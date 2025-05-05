import React from "react";
import { useState, useEffect } from "react";
import { getSmartLockContract } from "./utils/getContract";
import { keccak256, toUtf8Bytes } from "ethers";
import './index.css'; 

function SmartLock() {
    const [status, setStatus] = useState("");
    const [account, setAccount] = useState("");
    
    // Fungsi untuk connect ke wallet
    const connectWallet = async () => {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            setAccount(accounts[0]);
        } else {
            setStatus("Metamask not available");
        }
    };

    // Fungsi untuk disconnect wallet (log out)
    const disconnectWallet = () => {
        setAccount("");  // Menghapus informasi akun dari state
        setStatus("Wallet disconnected");
    };

    useEffect(() => {
        if (!account) {
            connectWallet();
        }
    }, [account]);

    // Fungsi untuk register smart lock
    const handleRegister = async () => {
        try {
            const contract = await getSmartLockContract();
            const lockId = keccak256(toUtf8Bytes("smartlock01"));
            const tx = await contract.registerLock(lockId);
            await tx.wait();
            setStatus("Lock registered!");
        } catch (err) {
            console.error(err);
            setStatus("Failed to register lock");
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>SmartLock System</h1>
            {account ? (
                <>
                    <p className="account-info">Connected Account: {account}</p>
                    <button className="register-button" onClick={handleRegister}>Register Lock</button>
                    <button className="register-button logout" onClick={disconnectWallet} style={{ marginTop: "1rem" }}>
                        Logout
                    </button>
                </>
            ) : (
                <button className="register-button" onClick={connectWallet}>Connect Wallet</button>
            )}
            <div className="status-container">
                <p className={`status-message ${status === "Lock registered!" ? "success" : "error"}`}>{status}</p>
            </div>
        </div>
    );
}

export default SmartLock;
