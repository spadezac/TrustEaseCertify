export default function CSVUploader() {
  function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    fetch("http://localhost:5000/api/upload-csv", {
      method: "POST",
      body: data,
      mode: "no-cors",
    }).then((response) => {
        console.log(response);
      response.json().then((data) => {
        console.log(data);
      });
    });
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold my-4">CSV Uploader</h1>
      <div className="flex flex-row items-center justify-center">
        <form
          method="POST"
          encType="multipart/form-data"
          onSubmit={handleUpload}
        >
          <input type="file" name="csv" className="m-2" />
          <input
            type="submit"
            value="Upload CSV"
            className="m-2 p-2 bg-blue-500 text-white rounded"
          />
        </form>
      </div>
    </div>
  );
}
