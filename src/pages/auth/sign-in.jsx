import { useState } from "react";
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { signInUser } from "@/apiService/apiService"; // ✅ your actual login function

export function SignIn() {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert("Please agree to the Terms and Conditions");
      return;
    }

    try {
      const userData = { username, password };
      const response = await signInUser(userData); // 🔐 Replace with your actual API call
      console.log("Login success", response);
      // Redirect or store token...
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Sign In</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your username and password to Sign In.</Typography>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your username
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              value={username}
              onChange={(e) => setusername(e.target.value)}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
            />

            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
            />
          </div>

          <Checkbox
            checked={agreeTerms}
            onChange={() => setAgreeTerms(!agreeTerms)}
            label={
              <Typography variant="small" color="gray" className="flex items-center justify-start font-medium">
                I agree to the&nbsp;
                <a href="#" className="font-normal text-black transition-colors hover:text-gray-900 underline">
                  Terms and Conditions
                </a>
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          />

          <Button className="mt-6" fullWidth type="submit">
            Sign In
          </Button>

          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Not registered?
            <Link to="/auth/sign-up" className="text-gray-900 ml-1">Create account</Link>
          </Typography>
        </form>
      </div>

      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
          alt="Auth Background"
        />
      </div>
    </section>
  );
}

export default SignIn;
