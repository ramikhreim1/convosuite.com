import { Link } from "react-router-dom"
import { observer, inject } from 'mobx-react'

const Footer = inject('store')(observer((props) => {
    return (
        <footer className="relative bg-blueGray-200 pt-8 pb-6 bg-white shadow-md border-t border-gray-300">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap text-center lg:text-left">
                    <div className="w-full flex flex-col items-center px-4 mb-5">
                        <button className="mt-2 mb-2 lg:mb-3">
                            <Link to="/" className="">
                                <img src='/logo.gif'></img>
                            </Link>
                        </button>
                        {/* <h4 className="text-3xl fonat-semibold text-blueGray-700 mb-2 mt-8">Let's keep in touch!</h4> */}
                        <h5 className="text-base mt-0 mb-2 text-blueGray-600">
                            Unlock the Power of AI with Revolutionary GPT-4 Powerd by OpenAI, Google , Dall-e and More!
                        </h5>
                    </div>
                    {/* <div className="w-full lg:w-8/12 px-4">
                        <div className="flex flex-wrap items-top mb-6">
                            <div className="w-6/12 md:w-4/12 px-4 ml-auto">
                                <ul className="list-unstyled">
                                    <li>
                                        <Link className="text-blueGray-600 hover:text-red-900 font-semibold block pb-2 text-sm" to="/aboutUs">About Us</Link>
                                    </li>
                                    <li>
                                        <Link className="text-blueGray-600 hover:text-red-900 font-semibold block pb-2 text-sm" to="/ai/dalle">DALL·E 2</Link>
                                    </li>
                                    <li>
                                        <Link className="text-blueGray-600 hover:text-red-900 font-semibold block pb-2 text-sm" to="/ai/chatGPT">Chat GP</Link>
                                    </li>
                                    <li>
                                        <Link className="text-blueGray-600 hover:text-red-900 font-semibold block pb-2 text-sm" to="/ai/WhatsApp">WhatsApp</Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="w-6/12 md:w-4/12 px-4">
                                <ul className="list-unstyled">
                                    <li>
                                        <Link className="text-blueGray-600 hover:text-red-900 font-semibold block pb-2 text-sm" to="/contact-Us#contact">Contact Us</Link>
                                    </li>
                                    <li>
                                        <Link className="text-blueGray-600 hover:text-red-900 font-semibold block pb-2 text-sm" to="/FAQ">FAQ</Link>
                                    </li>
                                    <li>
                                        <Link className="text-blueGray-600 hover:text-red-900 font-semibold block pb-2 text-sm" to="/terms-condition">Terms &amp; Conditions</Link>
                                    </li>
                                    <li>
                                        <Link className="text-blueGray-600 hover:text-red-900 font-semibold block pb-2 text-sm" to="/privacy-policy">Privacy Policy</Link>
                                    </li>
                                    <li>
                                        <Link className="text-blueGray-600 hover:text-red-900 font-semibold block pb-2 text-sm" to="/Cookie-Policy">Cookie Policy</Link>
                                    </li>
                                    <li>
                                        <Link className="text-blueGray-600 hover:text-red-900 font-semibold block pb-2 text-sm" to="/support">Support</Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="w-full lg:w-4/12 px-4 flex justify-center mt-6 md:mt-0">
                                <div className="payment-logo flex flex-col gap-3 justify-center">
                                    <div className="flex gap-4 items-center md:flex-col">
                                        <div className="" style={{ display: '-webkit-inline-box', verticalAlign: 'sub' }}>
                                            <svg
                                                className="mr-2"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="40"
                                                height="40"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M22.282 9.821a5.985 5.985 0 00-.516-4.91 6.046 6.046 0 00-6.51-2.9A6.065 6.065 0 004.981 4.18a5.985 5.985 0 00-3.998 2.9 6.046 6.046 0 00.743 7.097 5.98 5.98 0 00.51 4.911 6.051 6.051 0 006.515 2.9A5.985 5.985 0 0013.26 24a6.056 6.056 0 005.772-4.206 5.99 5.99 0 003.997-2.9 6.056 6.056 0 00-.747-7.073zM13.26 22.43a4.476 4.476 0 01-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 00.392-.681v-6.737l2.02 1.168a.071.071 0 01.038.052v5.583a4.504 4.504 0 01-4.494 4.494zM3.6 18.304a4.47 4.47 0 01-.535-3.014l.142.085 4.783 2.759a.771.771 0 00.78 0l5.843-3.369v2.332a.08.08 0 01-.033.062L9.74 19.95a4.5 4.5 0 01-6.14-1.646zM2.34 7.896a4.485 4.485 0 012.366-1.973V11.6a.766.766 0 00.388.676l5.815 3.355-2.02 1.168a.076.076 0 01-.071 0l-4.83-2.786A4.504 4.504 0 012.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 01.071 0l4.83 2.791a4.494 4.494 0 01-.676 8.105v-5.678a.79.79 0 00-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 00-.785 0L9.409 9.23V6.897a.066.066 0 01.028-.061l4.83-2.787a4.5 4.5 0 016.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 01-.038-.057V6.075a4.5 4.5 0 017.375-3.453l-.142.08-4.778 2.758a.795.795 0 00-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"></path>
                                            </svg>
                                            <span>powered by openAI</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                    <hr className="my-6 border-blueGray-300" />
                    <div className="flex flex-wrap w-full items-center md:justify-between justify-center">
                        <div className="w-full md:w-4/12 px-4 mx-auto text-center">
                            <div className="text-sm text-blueGray-500 font-semibold py-1">
                                Copyright © <span id="get-current-year">2023</span>
                                <Link to="/" className="text-blueGray-500 hover:text-red-900"> convosuite</Link>.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer >
    )
}))
export default Footer