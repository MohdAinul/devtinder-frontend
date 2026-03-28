import React, { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const dispatch = useDispatch();

  const [firstName, setFirstname] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoURL || ""); // ✅ correct
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender);
  const [about, setAbout] = useState(user.about);
  const [skills, setSkills] = useState(user.skills || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  // 🔥 IMAGE UPLOAD
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1000000) {
      alert("File too large");
      return;
    }

    const formData = new FormData();
    formData.append("photo", file);

    try {
      setLoading(true);

      const res = await axios.post(BASE_URL + "/api/upload", formData); // ❌ no credentials

      console.log("Uploaded URL:", res.data.imageUrl);

      setPhotoUrl(res.data.imageUrl);
    } catch (err) {
      console.error(err);
      setError("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 SAVE PROFILE
  const saveProfile = async () => {
    setError("");

    // ❗ prevent invalid URL
    if (!photoUrl || photoUrl.trim() === "") {
      alert("Please upload image first");
      return;
    }

    try {
      const res = await axios.post(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          photoURL: photoUrl, // ✅ IMPORTANT FIX
          age: Number(age),
          gender,
          about,
          skills,
        },
        {
          withCredentials: true,
        },
      );

      dispatch(addUser(res.data.data));

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.log("ERROR:", err.response?.data);
      setError(err?.response?.data || "Something went wrong");
    }
  };

  return (
    <>
      <div className="flex justify-center my-10">
        <div className="flex justify-center mx-10">
          <div className="card bg-base-300 w-96 shadow-xl">
            <div className="card-body">
              <h2 className="card-title justify-center">Edit Profile</h2>

              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstname(e.target.value)}
                placeholder="First Name"
                className="input input-bordered my-2"
              />

              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                className="input input-bordered my-2"
              />

              <input
                type="text"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Age"
                className="input input-bordered my-2"
              />

              {/* 🔥 IMAGE */}
              <input type="file" onChange={handleFile} />

              {loading && <p>Uploading...</p>}

              {/* {photoUrl && (
                <img
                  src={photoUrl}
                  className="w-24 h-24 rounded-full my-2"
                  alt="preview"
                />
              )} */}

              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="input input-bordered my-2"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>

              <input
                type="text"
                value={skills.join(",")}
                onChange={(e) => setSkills(e.target.value.split(","))}
                placeholder="Skills"
                className="input input-bordered my-2"
              />

              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="About"
                className="input input-bordered my-2"
              />

              <p className="text-red-500">{error}</p>

              <button
                className="btn btn-primary mt-2"
                onClick={saveProfile}
                disabled={loading}
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>

        <UserCard
          user={{
            firstName,
            lastName,
            photoUrl,
            about,
            age,
            gender,
            skills,
          }}
        />
      </div>

      {showToast && (
        <div className="toast toast-top toast-center pt-20">
          <div className="alert alert-success">
            <span>Profile saved successfully</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
