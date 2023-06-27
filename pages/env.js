require('dotenv').config();
export default function app() {
    console.log(process.env.ALCHEMY_POLYGON_API_KEY);
    console.log(process.env.privateKey);
    console.log(process.env.GATE_WAY);

    return <h1>123213</h1>   
}