interface propsType {
  bgcolor: string;
  progress: number;
  height: number;
}

const Progress_bar = ({ bgcolor, progress, height }: propsType) => {
  const Parentdiv = {
    height: height,
    width: '100%',
    backgroundColor: 'whitesmoke',
    borderRadius: 40,
    // margin: 50,  
  };

  const Childdiv = {
    height: '100%',
    width: `${progress*100}%`,
    backgroundColor: bgcolor,
    borderRadius: 40,
    // textAlign: 'right',
  };

  const progresstext = {
    padding: 10,
    color: 'black',
    fontWeight: 900,
  };

  return (
    <>
      <div style={Parentdiv}>
        <div style={Childdiv}>
          {/* <span style={progresstext}>{`${progress*100}%`}</span> */}
        </div>
      </div>
    </>
  );
};

export default Progress_bar;
