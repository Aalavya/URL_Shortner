import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {

  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [clickCount, setClickCount] = useState(0);

  const handleSubmit = () => {
    axios.post("http://localhost:3000/api/short", { originalUrl })
      .then((res) => {
        setShortUrl(res.data)
        console.log("API response", res.data)
      })
      .catch((err) => console.log(err))

  }

  useEffect(() => {
    if (shortUrl && shortUrl.shortUrl) {
      const shortUrlId = shortUrl.shortUrl.split("/").pop(); // Extract short URL ID

      const fetchClickCount = () => {
        axios
          .get(`http://localhost:3000/api/clicks/${shortUrlId}`)
          .then((res) => setClickCount(res.data.clicks))
          .catch((err) => console.log(err));
      };

      fetchClickCount();

      // Poll the click count every 5 seconds for live updates
      const intervalId = setInterval(fetchClickCount, 5000);

      return () => clearInterval(intervalId); // Cleanup on unmount
    }
  }, [shortUrl]);


  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
          <h1 className="bg-white rounded-lg shadow-lg p-8 mb-4 max-w-lg w-full"> URL Shortner to ease your Shares</h1>
          <div className="flex flex-col space-y-4" onSubmit={handleSubmit}>

            <input
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              type="text" name="orinalUrl" id=""
              placeholder="Enter your URL..."
              required
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button className="bg-blue-600 text-white rounded-md py-2 font-semibold hover:bg-blue-700 transition" onClick={handleSubmit}>Shorten</button>

            {
              shortUrl && (
                <div className="mt-6 text-center">
                  <p className="text-lg font-medium">Shortened Url</p>
                  <a href={shortUrl?.shortUrl} target="_blank"
                    className="text-blue-500 underline mt-2"
                    rel="noopner noreferrer"
                  >
                    {shortUrl?.shortUrl}
                  </a>
                  {shortUrl && <img src={shortUrl.qrCodeImg} alt="Generated QR Code" />}
                  <p>Click Count: {clickCount}</p>
                </div>
              )
            }
          </div>
        </div>


      </div>

    </>
  )
}

export default App
