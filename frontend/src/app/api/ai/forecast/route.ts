import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const NEXT_PUBLIC_BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://backend:8000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const response = await axios.post(
      `${NEXT_PUBLIC_BACKEND_URL}/api/ai/forecast`,
      { userId }
    );

    // Send the forecast data back to the frontend
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    return NextResponse.json(
      { error: "Failed to fetch forecast data from the AI service" },
      { status: 500 }
    );
  }
}
