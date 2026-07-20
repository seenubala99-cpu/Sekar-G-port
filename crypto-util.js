/* ==========================================================================
   CRYPTO UTILITY - AES-GCM 256-BIT ENCRYPTION & DECRYPTION
   ========================================================================== */

const CryptoUtil = (() => {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    // Helper: Convert ArrayBuffer to Base64
    function bufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    // Helper: Convert Base64 to ArrayBuffer
    function base64ToBuffer(base64) {
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }

    // Derive AES-GCM CryptoKey using PBKDF2
    async function deriveKey(password, salt) {
        const keyMaterial = await window.crypto.subtle.importKey(
            "raw",
            encoder.encode(password),
            { name: "PBKDF2" },
            false,
            ["deriveKey"]
        );

        return await window.crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: salt,
                iterations: 100000,
                hash: "SHA-256"
            },
            keyMaterial,
            { name: "AES-GCM", length: 256 },
            false,
            ["encrypt", "decrypt"]
        );
    }

    // Encrypt Data Object -> Base64 Encrypted String
    async function encryptData(dataObj, password) {
        try {
            const jsonString = JSON.stringify(dataObj);
            const dataBuffer = encoder.encode(jsonString);

            // Generate 16-byte random salt and 12-byte random IV
            const salt = window.crypto.getRandomValues(new Uint8Array(16));
            const iv = window.crypto.getRandomValues(new Uint8Array(12));

            const key = await deriveKey(password, salt);

            const ciphertext = await window.crypto.subtle.encrypt(
                { name: "AES-GCM", iv: iv },
                key,
                dataBuffer
            );

            const payload = {
                salt: bufferToBase64(salt),
                iv: bufferToBase64(iv),
                ciphertext: bufferToBase64(ciphertext)
            };

            return window.btoa(JSON.stringify(payload));
        } catch (err) {
            console.error("Encryption failed:", err);
            throw err;
        }
    }

    // Decrypt Base64 Encrypted String -> Data Object
    async function decryptData(encryptedPayloadBase64, password) {
        try {
            const rawPayload = JSON.parse(window.atob(encryptedPayloadBase64));
            const salt = new Uint8Array(base64ToBuffer(rawPayload.salt));
            const iv = new Uint8Array(base64ToBuffer(rawPayload.iv));
            const ciphertext = base64ToBuffer(rawPayload.ciphertext);

            const key = await deriveKey(password, salt);

            const decryptedBuffer = await window.crypto.subtle.decrypt(
                { name: "AES-GCM", iv: iv },
                key,
                ciphertext
            );

            const jsonString = decoder.decode(decryptedBuffer);
            return JSON.parse(jsonString);
        } catch (err) {
            console.warn("Decryption failed (Invalid password or corrupted data):", err);
            return null;
        }
    }

    return {
        encryptData,
        decryptData
    };
})();
