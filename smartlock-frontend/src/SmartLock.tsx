import React from "react";
import { useState, useEffect  } from "react";
import { getSmartLockContract } from "./utils/getContract";
import { keccak256, toUtf8Bytes } from "ethers";

function SmartLock() {
    const [status, setStatus] = useState("");
    const [account, setAccount] = useState("");

    const connectWallet = async () => {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            setAccount(account[0]);
        }   else {
            setStatus("Metamask not available")
        }
    };

    useEffect(() => {
        connectWallet();
    }, []);



    const handleRegister = async () => {
        try {
            const contract = await getSmartLockContract();
            const lockId = keccak256(toUtf8Bytes("smartlock01"));
            const tx = await contract.registerLock(lockId);
            await tx.wait();
            setStatus("Lock registered!");
        }   catch (err) {
            console.error(err);
            setStatus("Failed to register lock");
        }
    };

    return (
        <div style={{ padding: "2rem"}}>
            <button onClick={handleRegister}>Register Lock</button>
            <p>{status}</p>
        </div>
    );
}

export default SmartLock;