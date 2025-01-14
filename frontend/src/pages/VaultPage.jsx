



import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { VaultContext } from "../context/VaultContext";
import VaultItem from "../components/VaultItem";
import AddItemModal from "../components/AddItemModel";
import axios from "axios";
import { GlobalContext } from "../context/GlobalContext";


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
