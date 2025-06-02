import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { fireAuth } from "@/lib/firebase";

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Signup = () => {
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async () => {
    const values = form.getValues();
    try {
      const res = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        console.log("Signup successful:", data.user, "\n", data.message);
        form.reset();
      } else {
        const data = await res.json();
        console.error("Signup failed:", data.error);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    } finally {
      form.reset();
    }
    // const values = form.getValues();
    // const { email, password } = values;
    // createUserWithEmailAndPassword(fireAuth, email, password)
    //   .then((userCredential) => {
    //     const user = userCredential.user;
    //     console.log("Signup successful:", user);
    //     form.reset();
    //   })
    //   .catch((error) => {
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //     console.error("Signup failed:", errorCode, errorMessage);
    //     form.setError("email", {
    //       type: "manual",
    //       message: errorMessage,
    //     });
    //     form.reset();
    //   });
  };

  return (
    <div className="flex flex-col items-center px-28 justify-center h-screen bg-gray-100 p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Signup;
