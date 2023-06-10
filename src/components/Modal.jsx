import { useContext, useRef, useState } from "react";
import SignupModal from "./SignupModal";
import LoginModal from "./LoginModal";
import { AuthContext } from "../contexts/AuthContext";
import { ConnectionContext } from "../contexts/ConnectionContext";

export default function Modal() {
  const { user } = useContext(AuthContext);
  const { disconnect } = useContext(ConnectionContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const signupRef = useRef(null);
  const loginRef = useRef(null);

  return (
    <>
      {!user ? (
        <>
          <div className="flex gap-4">
            <button
              className="bg-cyan-700 border-cyan-900 border-2 rounded-lg hover:bg-cyan-800 cursor-pointer text-slate-400 py-3 px-6"
              onClick={() => {
                signupRef.current.show();
                setIsModalOpen(true);
              }}
            >
              SignUp
            </button>
            <button
              className="bg-cyan-700 border-cyan-900 border-2 rounded-lg hover:bg-cyan-800 cursor-pointer text-slate-400 py-3 px-6"
              onClick={() => {
                loginRef.current.show();
                setIsModalOpen(true);
              }}
            >
              LogIn
            </button>
          </div>
          {isModalOpen && (
            <div
              onClick={() => {
                signupRef.current.close();
                loginRef.current.close();
                setIsModalOpen(false);
              }}
              className="absolute top-0 left-0 w-full h-full z-30 backdrop:blur-3xl bg-red-400 opacity-10"
            ></div>
          )}
          <SignupModal modalRef={signupRef} setIsModalOpen={setIsModalOpen} />
          <LoginModal modalRef={loginRef} setIsModalOpen={setIsModalOpen} />
        </>
      ) : (
        <div className="flex items-center gap-5">
          <h3 className="text-slate-400 underline underline-offset-2">
            Hi {user.username}!
          </h3>
          <button
            className="bg-cyan-700 border-cyan-900 border-2 rounded-lg hover:bg-cyan-800 cursor-pointer text-slate-400 py-3 px-6 ml-3"
            onClick={() => {
              disconnect();
              setIsModalOpen(false);
            }}
          >
            LogOut
          </button>
        </div>
      )}
    </>
  );
}
