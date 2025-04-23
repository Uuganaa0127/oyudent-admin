
import { useState } from "react";
import { signUpUser } from "@/apiService/apiService";

export function SignUp() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    register: "",
    email: "",
    phone: "",
    password: "",
    passwordMatch: "",
    position: "", // ✅ Added position
  });

  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState(true);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateInputs = () => {
    const registerRegex = /^[A-Za-zА-Яа-яҮүӨө]{2}\d{8}$/;
    const phoneRegex = /^\d{8}$/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (client && !registerRegex.test(formData.register)) {
      return "Регистер 2 үсэг + 8 тоо байх ёстой. (Жишээ: AB12345678)";
    }
    if (!phoneRegex.test(formData.phone)) {
      return "Утасны дугаар 8 оронтой байх ёстой.";
    }
    if (formData.password.length < 8) {
      return "Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой.";
    }
    if (!emailRegex.test(formData.email)) {
      return "Имэйл хаяг зөв оруулна уу. (Жишээ: example@example.com)";
    }
    if (formData.password !== formData.passwordMatch) {
      return "Нууц үг тохирохгүй байна.";
    }
    if (!formData.position) {
      return "Албан тушаал сонгоно уу.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const validationError = validateInputs();
    if (validationError) {
      setMessage(validationError);
      setLoading(false);
      return;
    }

    try {
      const response = await signUpUser(formData, client);
      const x = response.json();
      console.log(x);

      setMessage("Бүртгэл амжилттай хийгдлээ! 🎉");
    } catch (error) {
      setMessage(error.message || "Бүртгэл амжилтгүй боллоо.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="overflow-hidden py-20 bg-gray-2">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setClient(false)}
              type="button"
              className={`w-full flex justify-center font-medium text-black py-3 px-6 rounded-lg transition-all duration-300 ${
                !client ? "bg-blue-600 shadow-lg scale-105" : "bg-gray-500 hover:bg-blue-500"
              }`}
            >
              User
            </button>
            <button
              onClick={() => setClient(true)}
              type="button"
              className={`w-full flex justify-center font-medium text-black py-3 px-6 rounded-lg transition-all duration-300 ${
                client ? "bg-blue-600 shadow-lg scale-105" : "bg-gray-500 hover:bg-blue-500"
              }`}
            >
              Client
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Firstname */}
            <div className="mb-5">
              <label htmlFor="lastname" className="block mb-2.5">Овог <span className="text-red">*</span></label>
              <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} required className="w-full py-3 px-5 rounded-xl border border-gray-300 bg-white text-gray-800 placeholder-gray-400 shadow-sm 
focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
/>
            </div>

            {/* Lastname */}
            <div className="mb-5">
              <label htmlFor="firstname" className="block mb-2.5">Нэр <span className="text-red">*</span></label>
              <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} required className="w-full py-3 px-5 rounded-xl border border-gray-300 bg-white text-gray-800 placeholder-gray-400 shadow-sm 
focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
/>
            </div>

            {/* Register */}
            {client && (
              <div className="mb-5">
                <label htmlFor="register" className="block mb-2.5">Регистер <span className="text-red">*</span></label>
                <input type="text" name="register" value={formData.register} onChange={handleChange} required className="w-full py-3 px-5 rounded-xl border border-gray-300 bg-white text-gray-800 placeholder-gray-400 shadow-sm 
focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
/>
              </div>
            )}

            {/* Phone */}
            <div className="mb-5">
              <label htmlFor="phone" className="block mb-2.5">Утасны дугаар <span className="text-red">*</span></label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className="w-full py-3 px-5 rounded-xl border border-gray-300 bg-white text-gray-800 placeholder-gray-400 shadow-sm 
focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
/>
            </div>

            {/* Email */}
            <div className="mb-5">
              <label htmlFor="email" className="block mb-2.5">И-мэйл хаяг <span className="text-red">*</span></label>
              <input type="text" name="email" value={formData.email} onChange={handleChange} required className="w-full py-3 px-5 rounded-xl border border-gray-300 bg-white text-gray-800 placeholder-gray-400 shadow-sm 
focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
/>
            </div>

            {/* Position */}
            <div className="mb-5">
              <label htmlFor="position" className="block mb-2.5">Албан тушаал <span className="text-red">*</span></label>
              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                className="rounded-lg border border-gray-300 bg-gray-100 w-full py-3 px-5 outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">-- Сонгоно уу --</option>
                <option value="worker">Worker</option>
                <option value="admin">Admin</option>
                <option value="cass">Cass</option>
              </select>
            </div>

            {/* Password */}
            <div className="mb-5">
              <label htmlFor="password" className="block mb-2.5">Нууц үг <span className="text-red">*</span></label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full py-3 px-5 rounded-xl border border-gray-300 bg-white text-gray-800 placeholder-gray-400 shadow-sm 
focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
/>
            </div>

            {/* Password Match */}
            <div className="mb-5">
              <label htmlFor="passwordMatch" className="block mb-2.5">Нууц үгээ давтна уу <span className="text-red">*</span></label>
              <input type="password" name="passwordMatch" value={formData.passwordMatch} onChange={handleChange} required className="w-full py-3 px-5 rounded-xl border border-gray-300 bg-white text-gray-800 placeholder-gray-400 shadow-sm 
focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
/>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg mt-6">
              {loading ? "Бүртгэж байна..." : "Бүртгүүлэх"}
            </button>

            {/* Message */}
            {message && <p className="text-center text-red-600 mt-4">{message}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}

export default SignUp;
