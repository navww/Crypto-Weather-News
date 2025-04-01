import { NextResponse } from 'next/server';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');
    const vsCurrency = searchParams.get('vs_currency');
    const ids = searchParams.get('ids');
    const order = searchParams.get('order');
    const perPage = searchParams.get('per_page');
    const page = searchParams.get('page');
    const sparkline = searchParams.get('sparkline');
    const localization = searchParams.get('localization');
    const tickers = searchParams.get('tickers');
    const marketData = searchParams.get('market_data');
    const communityData = searchParams.get('community_data');
    const developerData = searchParams.get('developer_data');

    if (!path) {
      return NextResponse.json(
        { error: 'Path parameter is required' },
        { status: 400 }
      );
    }

    // Construct the URL with all parameters
    const url = new URL(`${COINGECKO_API_URL}${path}`);
    
    // Add all non-null parameters to the URL
    if (vsCurrency) url.searchParams.append('vs_currency', vsCurrency);
    if (ids) url.searchParams.append('ids', ids);
    if (order) url.searchParams.append('order', order);
    if (perPage) url.searchParams.append('per_page', perPage);
    if (page) url.searchParams.append('page', page);
    if (sparkline) url.searchParams.append('sparkline', sparkline);
    if (localization) url.searchParams.append('localization', localization);
    if (tickers) url.searchParams.append('tickers', tickers);
    if (marketData) url.searchParams.append('market_data', marketData);
    if (communityData) url.searchParams.append('community_data', communityData);
    if (developerData) url.searchParams.append('developer_data', developerData);

    console.log('Fetching from CoinGecko:', url.toString());

    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('CoinGecko API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch data from CoinGecko' },
      { status: 500 }
    );
  }
} 