import React from "react";
import "./App.css";

const URL = "http://localhost:8001/api/user/file";
const URL_MULTI = "http://localhost:8001/api/user/multi";

const SIZE = 10 * 1024 * 1024;
function App() {
  // const [data, setData] = useState(null);

  const handleFileChange = async (e) => {
    const [file] = e.target.files;
    if (!file) return;
    const fileChunk = createFileChunk(file);
    const hashChunks = hashChunk(fileChunk, file.name);
    await uploadChunks(hashChunks, file.name);
  };

  const createFileChunk = (file, size = SIZE) => {
    const fileChunk = [];
    let cur = 0;
    while (cur < file.size) {
      fileChunk.push({ file: file.slice(cur, cur + size) });
      cur += size;
    }
    return fileChunk;
  };

  const hashChunk = (fileChunk, filename) => {
    console.log(fileChunk);
    return fileChunk.map((data, index) => ({
      chunk: data.file,
      hash: `${filename}-${index}`,
    }));
  };

  const uploadChunks = async (hashChunks, filename) => {
    const requestList = hashChunks.map(({ chunk, hash }) => {
      const formData = new FormData();
      formData.append("chunk", chunk);
      formData.append("hash", hash);
      formData.append("filename", filename);
      return fetch(URL, {
        method: "POST",
        body: formData,
        mode: "no-cors",
      });
    });
    await Promise.all(requestList);
  };

  const handleMultiUpdate = (e) => {
    const formData = new FormData();
    const [file] = e.target.files;
    formData.append("chunk", file);
    formData.append("hash", "index");
    formData.append("filename", "multi");
    fetch(URL_MULTI, {
      method: "POST",
      body: formData,
    });
  };
  return (
    <div className="App">
      <input type="file" onChange={handleFileChange} />
      <input type="file" onChange={handleMultiUpdate} multiple />
    </div>
  );
}

// function request({ url, method = "post", data, headers = {}, requestList }) {
//   return new Promise((resolve) => {
//     const xhr = new XMLHttpRequest();
//     xhr.open(method, url);
//     Object.keys(headers).forEach((key) =>
//       xhr.setRequestHeader(key, headers[key])
//     );
//     xhr.send(data);
//     xhr.onload = (e) => {
//       resolve({
//         data: e.target.response,
//       });
//     };
//   });
// }

export default App;
