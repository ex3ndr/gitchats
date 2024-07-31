import qs from 'qs';

export async function startAuth(platform: 'ios' | 'android' | 'web') {

    // Resolve callback
    let callback: string;
    if (platform === 'web') {
        callback = 'https://gitchats.com/auth/github'
    } else {
        callback = 'gitchats://auth/github'
    }

    // Resolve auth url
    const url = `https://github.com/login/oauth/authorize?${qs.stringify({ 'client_id': process.env.GITHUB_CLIENT_ID!, 'redirect_uri': callback })}`;

    return {
        url,
        callback
    }
}