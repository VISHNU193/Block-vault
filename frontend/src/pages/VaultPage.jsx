// // import React, { useContext, useState } from "react";
// // import { AuthContext } from "../context/AuthContext";
// // import { VaultContext } from "../context/VaultContext";
// // import VaultItem from "../components/VaultItem";
// // import AddItemModal from "../components/AddItemModel";

// // const VaultPage = () => {
// //   const { logout } = useContext(AuthContext);
// //   const { items } = useContext(VaultContext);
// //   const [isModalOpen, setModalOpen] = useState(false);
// //   console.log(items);
  
// //   return (
// //     <div className="vault-container">
// //       <header>
// //         <h1>Vault</h1>
// //         <button onClick={logout}>Logout</button>
// //       </header>
// //       <button onClick={() => setModalOpen(true)}>Add Item</button>
// //       <div className="vault-items">
// //         {items.map((item, index) => (
// //           <VaultItem key={index} item={item} index={index} />
// //         ))}
// //       </div>
// //       {isModalOpen && <AddItemModal closeModal={() => setModalOpen(false)} />}
// //     </div>
// //   );
// // };

// // export default VaultPage;




// import { useContext, useEffect, useState } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { VaultContext } from "../context/VaultContext";
// import VaultItem from "../components/VaultItem";
// import AddItemModal from "../components/AddItemModel";
// import axios from "axios";
// import { GlobalContext } from "../context/GlobalContext";
// const VaultPage = () => {
//   const { logout } = useContext(AuthContext);
//   const { items, setItems } = useContext(VaultContext); // Added `setItems` to context
//   const [isModalOpen, setModalOpen] = useState(false);
//   const { globalState } = useContext(GlobalContext);
//   const { email } = globalState;

//   // Fetch items from backend
//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/vault-items",{
//           headers: {
//             email: email,
//           },
//         });
//         console.log(`fetched items : ${response.data}`);
//         console.log(`fetched items : ${JSON.stringify(response.data)}`);
        
//         setItems(response.data); // Update VaultContext state
//       } catch (error) {
//         console.error("Error fetching vault items:", error);
//       }
//     };

//     fetchItems();
//   }, [setItems,email]);

//   // Save changes to backend
//   const saveChanges = async () => {
//     try {
//       console.log(`email : ${email}`);
      
//       await axios.post("http://localhost:5000/api/vault-items", { email:globalState.email, items:items });
//       alert("Changes saved successfully!");
//     } catch (error) {
//       console.error("Error saving changes:", error);
//       alert("Failed to save changes.");
//     }
//   };

//   return (
//     <div className="vault-container">
//       <header>
//         <h1>Vault</h1>
//         <button onClick={logout}>Logout</button>
//       </header>
//       <button onClick={() => setModalOpen(true)}>Add Item</button>
//       <button onClick={saveChanges}>Save Changes</button>
//       <div className="vault-items">
//         {items.map((item, index) => (
//           <VaultItem key={index} item={item} index={index} />
//         ))}
//       </div>
//       {isModalOpen && <AddItemModal closeModal={() => setModalOpen(false)} />}
//     </div>
//   );
// };

// export default VaultPage;




import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { VaultContext } from "../context/VaultContext";
import VaultItem from "../components/VaultItem";
import AddItemModal from "../components/AddItemModel";
import axios from "axios";
import { GlobalContext } from "../context/GlobalContext";

// Helper: Convert ArrayBuffer to Base6

// Helper: Encrypt data
// const encryptData = async (key, data) => {
//   const iv = crypto.getRandomValues(new Uint8Array(12)); // Random IV
//   const encoder = new TextEncoder();
//   const dataBuffer = encoder.encode(JSON.stringify(data)); // Convert data to string

//   const encrypted = await crypto.subtle.encrypt(
//     {
//       name: "AES-GCM",
//       iv,
//     },
//     key,
//     dataBuffer
//   );

//   return {
//     iv: arrayBufferToBase64(iv),
//     ciphertext: arrayBufferToBase64(encrypted),
//   };
// };

// // Helper: Decrypt data
// const decryptData = async (key, ivBase64, ciphertextBase64) => {
//   const iv = base64ToArrayBuffer(ivBase64);
//   const ciphertext = base64ToArrayBuffer(ciphertextBase64);

//   const decrypted = await crypto.subtle.decrypt(
//     {
//       name: "AES-GCM",
//       iv,
//     },
//     key,
//     ciphertext
//   );

//   const decoder = new TextDecoder();
  
//   // console.log(decoder.decode(decrypted));
  
//   return JSON.parse(decoder.decode(decrypted)); // Parse decrypted string back to object
// };

















// const encryptData = async (aesKey, data) => {
//   const iv = crypto.getRandomValues(new Uint8Array(12)); // Random IV
//   const encoder = new TextEncoder();
//   const dataBuffer = encoder.encode(JSON.stringify(data));

//   const encrypted = await crypto.subtle.encrypt(
//     {
//       name: "AES-GCM",
//       iv,
//     },
//     aesKey,
//     dataBuffer
//   );

//   return {
//     iv: btoa(String.fromCharCode(...new Uint8Array(iv))),
//     ciphertext: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
//   };
// };
// const decryptData = async (aesKey, encryptedData) => {
//   const { iv, ciphertext } = encryptedData;

//   // Convert Base64 back to Uint8Array
//   const ivArray = Uint8Array.from(atob(iv), (char) => char.charCodeAt(0));
//   const ciphertextArray = Uint8Array.from(atob(ciphertext), (char) => char.charCodeAt(0));

//   const decrypted = await crypto.subtle.decrypt(
//     {
//       name: "AES-GCM",
//       iv: ivArray,
//     },
//     aesKey,
//     ciphertextArray
//   );

//   const decoder = new TextDecoder();
//   return JSON.parse(decoder.decode(decrypted)); // Convert back to JSON
// };




// async function encryptData(aesKey, data) {
//   const iv = new Uint8Array(12);
//   window.crypto.getRandomValues(iv);
//   const encoder = new TextEncoder();
//   const dataBuffer = encoder.encode(JSON.stringify(data));

//   const encrypted = await window.crypto.subtle.encrypt(
//     {
//       name: "AES-GCM",
//       iv,
//     },
//     aesKey,
//     dataBuffer
//   );

//   return {
//     iv: btoa(String.fromCharCode(...iv)),
//     ciphertext: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
//   };
// }

// async function decryptData(aesKey, encryptedData) {
//   const { iv, ciphertext } = encryptedData;

//   // Convert Base64 back to Uint8Array
//   const ivArray = new Uint8Array(atob(iv).split("").map((char) => char.charCodeAt(0)));
//   const ciphertextArray = new Uint8Array(atob(ciphertext).split("").map((char) => char.charCodeAt(0)));

//   const decrypted = await window.crypto.subtle.decrypt(
//     {
//       name: "AES-GCM",
//       iv: ivArray,
//     },
//     aesKey,
//     ciphertextArray
//   );

//   const decoder = new TextDecoder();
//   return JSON.parse(decoder.decode(decrypted)); // Convert back to JSON
// }

async function encryptData(aesKey, data) {
  const iv = new Uint8Array(12);
  window.crypto.getRandomValues(iv);
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(JSON.stringify(data));

  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    aesKey,
    dataBuffer
  );

  const encodedIv = btoa(String.fromCharCode(...iv));
  const encodedCiphertext = btoa(String.fromCharCode(...new Uint8Array(encrypted)));

  return {
    iv: encodedIv,
    ciphertext: encodedCiphertext,
  };
}

// async function decryptData(aesKey,iv,ciphertext) {
//   // const { iv, ciphertext } = encryptedData;

//   const decodedIv = new Uint8Array(atob(iv).split('').map(char => char.charCodeAt(0)));
//   const decodedCiphertext = new Uint8Array(atob(ciphertext).split('').map(char => char.charCodeAt(0)));

//   const decrypted = await window.crypto.subtle.decrypt(
//     {
//       name: "AES-GCM",
//       iv: decodedIv,
//     },
//     aesKey,
//     decodedCiphertext
//   );

//   const decoder = new TextDecoder();
//   return JSON.parse(decoder.decode(decrypted)); // Convert back to JSON
// }


async function decryptData(aesKey,iv, ciphertext) {
  // const { iv, ciphertext } = encryptedData;

  const decodedIv = new Uint8Array(atob(iv.replace(/-/g, "+").replace(/_/g, "/")).split('').map(char => char.charCodeAt(0)));
  const decodedCiphertext = new Uint8Array(atob(ciphertext.replace(/-/g, "+").replace(/_/g, "/")).split('').map(char => char.charCodeAt(0)));

  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: decodedIv,
    },
    aesKey,
    decodedCiphertext
  );

  const decoder = new TextDecoder();
  return JSON.parse(decoder.decode(decrypted)); // Convert back to JSON
}
























// Helper function to convert Uint8Array to Base64
// const arrayBufferToBase64 =async (buffer) => {
//   const binary = await Array.from(new Uint8Array(buffer))
//     .map((byte) => String.fromCharCode(byte))
//     .join('');
//   return btoa(binary);
// };

// // Helper function to convert Base64 to Uint8Array
// const base64ToArrayBuffer = async (base64) => {
//   const binary = await atob(base64)
//   console.log(binary);
  
//   const array = new Uint8Array(binary.length);
//   for (let i = 0; i < binary.length; i++) {
//     array[i] = binary.charCodeAt(i);
//   }
//   return array;
// };

// // Encrypt function (no changes)
// const encryptData = async (aesKey, data) => {
//   const iv = crypto.getRandomValues(new Uint8Array(12)); // Random IV
//   const encoder = new TextEncoder();
//   const dataBuffer = encoder.encode(JSON.stringify(data));

//   const encrypted = await crypto.subtle.encrypt(
//     {
//       name: "AES-GCM",
//       iv,
//     },
//     aesKey,
//     dataBuffer
//   );

//   return {
//     iv: arrayBufferToBase64(iv), // Encode iv to Base64
//     ciphertext: arrayBufferToBase64(encrypted), // Encode ciphertext to Base64
//   };
// };

// // Decrypt function (updated for correct decoding)
// const decryptData = async (aesKey, encryptedData) => {
//   const { iv, ciphertext } = encryptedData;

//   // Convert Base64 back to Uint8Array
//   const ivArray = base64ToArrayBuffer(iv);
//   const ciphertextArray = base64ToArrayBuffer(ciphertext);

//   const decrypted = await crypto.subtle.decrypt(
//     {
//       name: "AES-GCM",
//       iv: ivArray,
//     },
//     aesKey,
//     ciphertextArray
//   );

//   const decoder = new TextDecoder();
//   return JSON.parse(decoder.decode(decrypted)); // Convert back to JSON
// };




const VaultPage = () => {
  const { logout } = useContext(AuthContext);
  const { items, setItems } = useContext(VaultContext);
  const [isModalOpen, setModalOpen] = useState(false);
  const { globalState } = useContext(GlobalContext);
  const { email, aesKey, } = globalState; // Access derived key from GlobalContext

  // Fetch items from backend
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/vault-items", {
          headers: {
            email: email,
          },
        });
        
        const { iv, encryptedData } = response.data;

        console.log(iv);
        console.log(encryptedData.slice(1,-1));
        

        // Decrypt the fetched data
        const decryptedItems = await decryptData(aesKey, iv,encryptedData.slice(1,-1));
        console.log(decryptedItems);
        // console.log(JSON.parse(decryptedItems));
        
        
        setItems(decryptedItems); // Update VaultContext state with decrypted data
      } catch (error) {
        console.error("Error fetching vault items:", error);
      }
    };

    fetchItems();
  }, [setItems, email, aesKey]);

  // Save changes to backend
  const saveChanges = async () => {
    try {
      // Encrypt the items before sending
      const { iv, ciphertext } = await encryptData(aesKey, items);

      await axios.post("http://localhost:5000/api/vault-items", {
        email,
        iv,
        ciphertext,
      });

      alert("Changes saved successfully!");
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Failed to save changes.");
    }
  };

  return (
    <div className="vault-container">
      <header>
        <h1>Vault</h1>
        <button onClick={logout}>Logout</button>
      </header>
      <button onClick={() => setModalOpen(true)}>Add Item</button>
      <button onClick={saveChanges}>Save Changes</button>
      <div className="vault-items">
        {items.map((item, index) => (
          <VaultItem key={index} item={item} index={index} />
        ))}
      </div>
      {isModalOpen && <AddItemModal closeModal={() => setModalOpen(false)} />}
    </div>
  );
};

export default VaultPage;
