import axios from "../api/axios";

export const uploadFile =
  async (file) => {
    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    const response =
      await axios.post(
        "/upload",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data;
  };

export const uploadMultipleFiles =
  async (files) => {
    const formData =
      new FormData();

    files.forEach(
      (file) => {
        formData.append(
          "files",
          file
        );
      }
    );

    const response =
      await axios.post(
        "/upload/multiple",
        formData
      );

    return response.data;
  };