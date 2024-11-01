const ApiUsage = require("../models/apiUsage");
const User = require("../models/user");
const ErrorHandler = require("../utils/errorhander");
const History = require("../models/history")
const Members = require("../models/member")


async function getApiUsageData(req, res, next) {
  if (!req.isLoggedIn)
    next(new ErrorHandler("Not Logged In", 401))

  // return res.status(401).json({ err: "Not logged in" });
  const adminId = req.user._id;
  const adminData = await User.findById(adminId);
  const { names, types, startTime, endTime } = req.body;

  try {
    const matchQuery = {};

    if (names && names.length > 0) {
      matchQuery.name = { $in: names };
    }

    if (types && types.length > 0) {
      matchQuery.type = { $in: types };
    }

    // If startTime and endTime are not provided, set default time limit of one week
    if (!startTime && !endTime) {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      matchQuery.createdAt = { $gte: oneWeekAgo };
    }

    if (startTime && endTime) {
      matchQuery.createdAt = {
        $gte: new Date(startTime),
        $lte: new Date(endTime),
      };
    }
    const userIds = adminData.users
    userIds.push(adminId)
    matchQuery.userId = { $in: userIds };
    // Aggregation pipeline stages
    const pipeline = [
      { $match: matchQuery },
      {
        $project: {
          _id: "$_id", // Exclude the default _id field
          name: "$name",
          type: "$type",
          userId: "$userId",
          date: "$createdAt",
        },
      },
      // Add any additional aggregation stages here if needed
    ];

    // Execute the aggregation query
    const result = await ApiUsage.aggregate(pipeline);

    res.json(result);
  } catch (error) {
    next(error);
  }
}

const getAdminUsersActivity = async (req, res, next) => {
  try {
    const { } = req.body
    const admin = await User.findById(req.user._id);
    const adminUsers = admin.users
    console.log(adminUsers);
    if (adminUsers && (adminUsers?.length === 0)) {
      throw new ErrorHandler("You have zero members", 400)
    }
    // Define the aggregation pipeline
    const pipeline = [
      {
        $match: {
          user: { $in: adminUsers },
        },
      },
      {
        $group: {
          _id: "$user",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users", // Replace with the actual name of your users collection
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 0,
          email: "$user.email",
          fname: "$user.fname",
          count: 1,
        },
      },
    ];

    // Execute the aggregation pipeline
    const result = await History.aggregate(pipeline)

    return res.json(result)
  } catch (error) {
    next(error)
  }
}
const mostUseCase = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id, { users: 1 });
    const users = user?.users || [];

    const usageData = await History.aggregate([
      {
        $match: {
          user: {
            $in: users,
          },
        },
      },
      {
        $group: {
          _id: "$user",
          count: { $sum: 1 },
        },
      },
    ]);

    const rolesAndUsage = await Members.aggregate([
      {
        $match: {
          userId: {
            $in: users,
          },
        },
      },
      {
        $project: {
          role: "$role", // Adjust this based on your roles structure
          _id: "$userId",
        },
      },
    ]);

    const result = calculateRoleUsage(rolesAndUsage, usageData);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

const timeSavedEstimate = async (req, res, next) => {
  try {
    const { userId = null } = req.query
    const user = await User.findById(req.user._id, { users: 1, accountType: 1 });
    let users = [];
    if (userId && user.accountType === 'admin') {
      users.push(userId)
    } else {
      users = user?.users || []
    }
    let match = {
      user: {
        $in: users, // when me = true the time save for user itself will be filtered
      },
    }

    const usageData = await History.aggregate([
      {
        $match: match,
      },
      {
        $addFields: {
          "createdDate": {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$created"
            }
          }
        }
      },
      {
        $group: {
          "_id": "$createdDate",
          "totalOutputLength": { $sum: "$outputLength" }
        }
      },
      {
        $addFields: {
          "chatbotTimeInMinutes": {
            $divide: ["$totalOutputLength", 1000]
          },
        }
      },
      {
        $addFields: {
          "userTimeInMinutes": {
            $multiply: ["$chatbotTimeInMinutes", 60]
          },
          "timeSavedInMinutes": {
            $subtract: [
              { $multiply: ["$chatbotTimeInMinutes", 60] },
              { $divide: ["$totalOutputLength", 1000] }
            ]
          }
        }
      }
    ]);

    res.json(usageData);

  } catch (error) {
    next(error);
  }
};

const productivityEstimate = async (req, res, next) => {
  try {
    const { userId = null } = req.query
    const user = await User.findById(req.user._id, { users: 1, accountType: 1 });
    let users = [];
    if (userId && user.accountType === 'admin') {
      users.push(userId)
    } else {
      users = user?.users || []
    }
    let match = {
      user: {
        $in: users, // when me = true the time save for user itself will be filtered
      },
    }

    const usageData = await History.aggregate([
      {
        $match: match,
      },
      {
        $addFields: {
          "createdDate": {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$created"
            }
          }
        }
      },
      {
        $group: {
          "_id": "$createdDate",
          "count": { $sum: 1 }
        }
      },
    ]);

    res.json(usageData);

  } catch (error) {
    next(error);
  }
};


function calculateRoleUsage(usersWithRoles, resourceUsage) {
  const roleUsage = {};

  // Iterate through resourceUsage and build a usage count based on _id
  resourceUsage.forEach(resource => {
    if (roleUsage[resource._id]) {
      roleUsage[resource._id] += resource.count;
    } else {
      roleUsage[resource._id] = resource.count;
    }
  });

  const result = [];

  // Iterate through usersWithRoles and create an array of role usage
  usersWithRoles.forEach(user => {
    if (roleUsage[user._id]) {
      result.push({ role: user.role, usageCount: roleUsage[user._id] });
    }
  });

  return result;
}


module.exports = { getApiUsageData, getAdminUsersActivity, mostUseCase, timeSavedEstimate, productivityEstimate };