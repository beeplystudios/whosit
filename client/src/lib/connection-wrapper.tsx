import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { ConnectionContext, ConnectionStatus } from "./connection";

const MIN_LOADING_TIME = 500;

export const ConnectionWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [status, setStatus] = useState<ConnectionStatus>({
    type: "disconnected",
  });
  const ioRef = useRef<ReturnType<typeof io>>();

  useEffect(() => {
    if (ioRef.current) return;

    ioRef.current = io(import.meta.env.DEV ? "http://localhost:3000" : "https://whosit-server.fly.dev");

    const now = Date.now();
    setStatus({ type: "connecting" });

    ioRef.current.on("connect", () => {
      // Delay the connected status to prevent flickering
      if (Date.now() - now < MIN_LOADING_TIME) {
        setTimeout(
          () => {
            setStatus({ type: "connected" });
          },
          MIN_LOADING_TIME - (Date.now() - now)
        );
      } else setStatus({ type: "connected" });
    });

    ioRef.current.on("disconnect", () => {
      setStatus({ type: "disconnected" });
    });

    return () => {
      ioRef.current?.disconnect();
      ioRef.current = undefined;
    };
  }, []);

  if (!ioRef.current) return <div>Loading...</div>;

  return (
    <ConnectionContext.Provider
      value={{
        io: ioRef.current ?? null,
        status,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};
