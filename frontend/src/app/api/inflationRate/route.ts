import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {

  const FRED_API_KEY = "0857d96cf840ed8f3f374d2d2f4e13e6";
  const series_id = "T10YIE";

  if (!FRED_API_KEY) {
    return NextResponse.json(
      { error: "FRED API key is not configured." },
      { status: 500 }
    );
  }

  try {
    const response = await axios.get(
      "https://api.stlouisfed.org/fred/series/observations",
      {
        params: {
          api_key: FRED_API_KEY,
          series_id: series_id,
          file_type: "json",
          sort_order: "desc",
          limit: 1,
        },
      }
    );

    const latestObservation = response.data.observations[0];
    const inflationRate = parseFloat(latestObservation.value);

    return NextResponse.json({ inflationRate }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching inflation rate:", error);

    return NextResponse.json(
      { error: "Error fetching inflation rate", details: error.message },
      { status: 500 }
    );
  }
}
