const readline = require("readline");

// Fungsi untuk menghitung eksponensiasi modular
function modExp(base, exp, mod) {
    let result = 1;
    while (exp > 0) {
        if (exp % 2 === 1) {
            result = (result * base) % mod;
        }
        base = (base * base) % mod;
        exp = Math.floor(exp / 2);
    }
    return result;
}

// Fungsi untuk menghitung invers modular
function modInverse(a, m) {
    const m0 = m;
    let y = 0,
        x = 1;

    if (m === 1) return 0;

    while (a > 1) {
        const q = Math.floor(a / m);
        let t = m;

        m = a % m;
        a = t;
        t = y;

        y = x - q * y;
        x = t;
    }

    if (x < 0) x += m0;

    return x;
}

// Fungsi untuk menghasilkan kunci RSA
function generateKeys() {
    const p = 61;
    const q = 53;
    const n = p * q;
    const phi = (p - 1) * (q - 1);
    const e = 17;
    const d = modInverse(e, phi);

    const publicKey = { e, n };
    const privateKey = { d, n };

    return { publicKey, privateKey };
}

// Fungsi untuk mengenkripsi teks menjadi bilangan
function textToNumbers(text) {
    return text
        .split("")
        .map((char) => char.charCodeAt(0))
        .join("");
}

// Fungsi untuk mendekripsi bilangan menjadi teks
function numbersToText(numbers) {
    const numArray = numbers.match(/.{1,3}/g);
    return numArray.map((num) => String.fromCharCode(parseInt(num))).join("");
}

// Fungsi untuk mengenkripsi pesan
function encryptMessage(message, publicKey) {
    return modExp(message, publicKey.e, publicKey.n);
}

// Fungsi untuk mendekripsi pesan
function decryptMessage(ciphertext, privateKey) {
    return modExp(ciphertext, privateKey.d, privateKey.n);
}

// Inisialisasi antarmuka readline untuk input pengguna
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const { publicKey, privateKey } = generateKeys();
console.log(`Public Key: (${publicKey.e}, ${publicKey.n})`);
console.log(`Private Key: (${privateKey.d}, ${privateKey.n})`);

rl.question("Enter a message to encrypt: ", (message) => {
    const encryptedMessage = encryptMessage(textToNumbers(message), publicKey);
    console.log(`Encrypted Message: ${encryptedMessage}`);

    rl.question("Enter a ciphertext to decrypt: ", (ciphertext) => {
        const decryptedMessage = numbersToText(
            decryptMessage(parseInt(ciphertext), privateKey).toString()
        );
        console.log(`Decrypted Message: ${decryptedMessage}`);

        rl.close();
    });
});
