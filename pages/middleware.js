import {getToken}from"next-auth/jwt";
import {NextResponse} from"next/server";

export async function middleware(req){

    //token will exist if user is logged in
    const token = await getToken({req,secret:process.env.JWT_SECRET});


    const { pathName } = req.nextUrl;

    //allow the request if the following is true
    //here!! it does not return back to login

    if(pathName.includes("/api/auth") || token){
        return NextResponse.next();
    }

    if(!token && pathName !== "/login"){

        return NextResponse.redirect("/login");
    }

}