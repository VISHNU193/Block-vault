

---

# Block Vault -- Decentralized Password Manager

Welcome to the **Decentralized Password Manager**! This application leverages **IPFS (InterPlanetary File System)** to provide a secure, decentralized, and privacy-focused solution for storing and managing passwords. By combining state-of-the-art cryptography and the power of decentralized technology, this project ensures that your sensitive data is secure and accessible only to you.

---

## 🚀 Features

- **Decentralized Storage**: Store encrypted password data on IPFS, ensuring no central authority has access.
- **Strong Encryption**: Uses AES-GCM for encryption and PBKDF2 for secure key derivation.
- **Authentication Integrity**: Implements HMAC for tamper-proof authentication.
- **Cross-Device Access**: Retrieve your passwords securely from anywhere with your encryption key and password.
- **High Security Standards**: Employs 256-bit AES encryption and a high iteration count (600,000) for PBKDF2.
- **Tamper-Resistant**: Data integrity is maintained via cryptographic authentication mechanisms.
- **Future-Proof**: Decentralized architecture eliminates the risks of server-side breaches or takedowns.

---

## 🛠️ Technologies Used

- **Frontend**: React.js (with functional components and hooks)
- **Backend**: Node.js + Express (for API handling)
- **IPFS**: For decentralized storage
- **Web Cryptography API**: For encryption, decryption, and key management
- **React Router**: For navigation
- **Axios**: For making API requests

---

## 🧩 How It Works

1. **User Authentication**:
   - User provides a master password, which is never stored.
   - A **PBKDF2-derived key** is generated using the master password and a unique salt.

2. **Encryption**:
   - Passwords are encrypted using **AES-GCM** with a derived encryption key.
   - Data is signed with an **HMAC** for integrity verification.

3. **Storage**:
   - The encrypted data, along with the initialization vector (IV) and salt, is uploaded to **IPFS**.

4. **Decryption**:
   - The user retrieves the encrypted data from IPFS.
   - The master password is used to regenerate the decryption key, ensuring only the user can decrypt their data.

---

## 📂 Project Structure

```plaintext
├── src/
│   ├── components/
│   │   ├── LoginForm.jsx
│   │   ├── VaultPage.jsx
│   ├── context/
│   │   ├── GlobalContext.jsx
│   ├── utils/
│   │   ├── cryptoUtils.js  # Encryption/Decryption logic
│   ├── App.js
├── server/
│   ├── routes/
│   │   ├── userRoutes.js
│   ├── controllers/
│   │   ├── userController.js
│   ├── server.js
├── README.md
```

---

## 🛠️ Setup and Installation

### Prerequisites

1. **Node.js** (v14 or higher)
2. **IPFS Daemon** (or use a public IPFS gateway)

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/VISHNU193/Block-vault.git
   cd decentralized-password-manager
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the IPFS daemon:

   ```bash
   ipfs daemon
   ```

4. Start the backend server:

   ```bash
   cd server
   npm start
   ```

5. Start the frontend:

   ```bash
   cd src
   npm start
   ```

6. Open the app in your browser at `http://localhost:3000`.

---

## 🔒 Security Practices

- **Data Encryption**: All passwords are encrypted locally before uploading to IPFS.
- **No Plaintext Storage**: Neither the backend nor IPFS ever receives or stores plaintext passwords.
- **Zero Trust**: The master password is never stored anywhere, ensuring only the user has access.
- **High Iterations for PBKDF2**: Prevent brute-force attacks by using 600,000 iterations.

---

## 🌟 Future Enhancements

- **Mobile App Support**: Extend compatibility to iOS and Android platforms.
- **Biometric Authentication**: Add fingerprint or face ID for enhanced security.
- **Social Recovery**: Implement recovery options using trusted contacts.
- **Encrypted Sharing**: Enable secure password sharing with trusted users.
- **Password Generator**: Integrate a strong password generator.

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m "Add feature-name"`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 🙌 Acknowledgements

- [IPFS](https://ipfs.io) for decentralized storage
- [Web Cryptography API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) for secure encryption
- [React](https://reactjs.org/) for building the user interface

---

Feel free to reach out if you have questions or suggestions. Happy managing! 🛡️

