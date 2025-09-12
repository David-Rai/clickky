
// export const URL="http://localhost:1111"
// config.ts (or wherever you keep constants)
if (!process.env.NEXT_PUBLIC_SERVER_URL) {
    throw new Error("❌ NEXT_PUBLIC_SERVER_URL is not defined in environment variables");
  }
  
  export const URL= process.env.NEXT_PUBLIC_SERVER_URL;
  