import React from "react";
import { toast } from "react-toastify";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import stairs from "../../assets/stairs.avif";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch, useSelector } from "react-redux";
import {
  googleSignIn,
  logIn,
  setError,
} from "../../redux/features/authSlice";
import axios from "axios";
import GoogleIcon from "@mui/icons-material/Google";


export default function Login() {
  const [formData, setFormData] = React.useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });


  // const [fillInputError, setFillInputError] = React.useState({
  //   userName: false,
  //   email: false,
  //   password: false,
  //   confirmPassword: false,
  // });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error,loading } = useSelector((state) => state.auth);
  

  function handleChange(e) {
    setFormData((item) => {
      return {
        ...item,
        [e.target.name]: e.target.value,
      };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(setError());

    if (formData.password && formData.email) {
      dispatch(logIn({ formData, navigate, toast }));
    } else {
      toast.error("Please fill out fields");
    }
  }

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );
        dispatch(setError());
        //console.log(res.data)
        //console.log(tokenResponse);
        const { email, name, sub } = res.data;
        const result = { email, userName: name, sub };
        dispatch(googleSignIn({ result, navigate, toast }));
      } catch (e) {
        console.log(e);
      }
    },
  });

  React.useEffect(() => {
    error && toast.error(error);
  }, [error]);

  

  return (
    <Box className="w-screen h-screen flex justify-center sign2">
      {/* Container for content */}
      <Box className=" bg-white sign1 w-[95%] mt-[50px] md:h-[800px] h-[580px] lg:w-[80%] 2xl:w-[70%] lg:mt-[50px] lg:h-[700px] flex md:flex-row flex-col rounded-xl">
        {/* Image on the left side */}
        <Box className="md:flex w-[55%] h-full hidden rounded-l-xl">
          <img
            src={stairs}
            alt=""
            className=" w-full object-cover rounded-l-xl"
          />
        </Box>

        {/* Right side input */}
        <Box className="md:flex hidden justify-center w-[45%] mt-2 ">
          {/* Right Side Content Container */}
          <Box className="w-full flex flex-col">
            <span className="flex justify-end mr-1 mb-1">
              <IconButton>
                <SettingsIcon className=" text-base" />
              </IconButton>
            </span>

            <Box className="flex flex-col justify-center my-4">
              <IconButton>
                <PersonIcon className="text-[40px] mb-2" />
              </IconButton>

              <Typography className="text-2xl flex justify-center">
                Log In
              </Typography>
            </Box>

            <form
              className="flex flex-col justify-center items-center mt-5"
              onSubmit={(e) => handleSubmit(e)}
            >
              <TextField
                label="E-mail *"
                type="email"
                className="md:w-[95%] lg:w-[80%] rounded-2xl inputRounded mb-2 "
                sx={{ border: "none", "& fieldset": { border: "none" } }}
                value={formData.email}
                name="email"
                onChange={(e) => handleChange(e)}
              />

              <TextField
                label="Password *"
                className="md:w-[95%] lg:w-[80%] rounded-2xl inputRounded my-2 "
                sx={{ border: "none", "& fieldset": { border: "none" } }}
                value={formData.password}
                name="password"
                onChange={(e) => handleChange(e)}
                autoComplete=""
                type="password"
              />


              <Button
                variant="contained"
                type="submit"
                className="md:w-[95%] lg:w-[80%] my-2 bg-blue-400"
                disabled={loading}
              >
                {loading? "Loading..." : "Log In"}
              </Button>
            </form>

            {/* <Box className="w-full flex justify-center">
                <Box className="md:w-[95%] lg:w-[80%] flex">
                    <IconButton>
                      <GoogleIcon />
                    </IconButton>

                    <Button className="w-full bg-red-500">Sign In</Button>
                </Box>
            </Box> */}
            <Box className="flex justify-center ">
              <Button
                className="md:w-[95%] lg:w-[80%] my-2 bg-red-500 flex text-gray-300 hover:bg-red-700"
                onClick={googleLogin}
                disabled={loading}
              >
                <GoogleIcon className="mr-1" />
                {loading ? "Loading..." : "Sign Up"}
              </Button>
            </Box>

            <Typography className="flex justify-center my-2 items-center">
              Dont already have an account?{" "}
              <span
                onClick={() => dispatch(setError())}
                className="ml-1 border-b-2 border-blue-400 text-blue-400 cursor-pointer hover:text-blue-600 hover:border-blue-600"
              >
                <Link to="/signup">Sign Up</Link>
              </span>
            </Typography>
          </Box>
        </Box>

        {/* Mobile Section */}
        <Box className="md:hidden flex flex-col justify-center">
          <Box className="w-full flex flex-col">
            <span className="flex justify-end mr-1 mb-1">
              <IconButton>
                <SettingsIcon className=" text-base" />
              </IconButton>
            </span>

            <Box className="flex flex-col justify-center my-4">
              <IconButton>
                <PersonIcon className="text-[40px] mb-2" />
              </IconButton>

              <Typography className="text-2xl flex justify-center">
                Log In
              </Typography>
            </Box>

            <form
              className="flex flex-col justify-center items-center mt-5"
              onSubmit={(e) => handleSubmit(e)}
            >
              <TextField
                label="E-mail *"
                type="email"
                className="w-[80%] rounded-2xl inputRounded mb-2 "
                sx={{ border: "none", "& fieldset": { border: "none" } }}
                value={formData.email}
                name="email"
                onChange={(e) => handleChange(e)}
              />

              <TextField
                label="Password *"
                className="w-[80%] rounded-2xl inputRounded my-2 "
                sx={{ border: "none", "& fieldset": { border: "none" } }}
                value={formData.password}
                name="password"
                onChange={(e) => handleChange(e)}
                autoComplete=""
                type="password"
              />

              <Button
                variant="contained"
                type="submit"
                className="w-[80%] my-2 bg-blue-400"
                disabled={loading}
              >
                {loading? "Loading..." : "Log In"}
              </Button>
            </form>

            {/* <Box className="w-full flex justify-center">
                <Box className="w-[80%] flex">
                    <IconButton>
                      <GoogleIcon />
                    </IconButton>

                    <Button className="w-full bg-red-500">Sign In</Button>
                </Box>
            </Box> */}
            <Box className="flex justify-center ">
              <Button
                className="w-[80%] my-2 bg-red-500 flex text-gray-300 hover:bg-red-700"
                onClick={googleLogin}
                disabled={loading}
              >
                <GoogleIcon className="mr-1" />
                {loading? "Loading..." : "Sign In"}
              </Button>
            </Box>

            <Typography className="flex justify-center my-2 items-center">
              Dont already have an account?{" "}
              <span
                onClick={() => dispatch(setError())}
                className="ml-1 border-b-2 border-blue-400 text-blue-400 cursor-pointer hover:text-blue-600 hover:border-blue-600"
              >
                <Link to="/signup">Sign Up</Link>
              </span>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
