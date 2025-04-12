<div align="center">
  <a href="https://github.com/allennguyen01/Jukeboxd">
    <img src="./public/logo.svg" alt="Logo" width="300">
  </a>

  <h1>Jukeboxd</h1>

</div>

## About The Project

https://jukeboxd-azure.vercel.app/

Jukeboxd is the ultimate social platform for music lovers and audiophiles. Inspired by the community-driven success of Letterboxd, Jukeboxd offers a space for users to discover, rate, and review albums across all genres. No matter what music you're into, Jukeboxd lets you express your opinions and connect with others who share your taste in music.

Whether you're a casual listener or a hardcore music enthusiast, Jukeboxd provides the perfect platform to dive deeper into the world of music, discover new sounds, and share your love of albums with a vibrant community.

## Deployment Status

![Vercel Deploy](https://deploy-badge.vercel.app/vercel/jukeboxd-azure)

## Tech Stack

- <div style="display:flex;align-items:center;gap:8px;">
    Frontend:
    <span>TypeScript</span> <img src="https://github.com/user-attachments/assets/235fa721-76b0-4437-8ade-598baaa1bf93" width="20">,
    <span>React</span> <img src="https://github.com/user-attachments/assets/a6ee1799-0c00-4722-a648-02678e22fa93" width="20">,
    <span>Vite</span> <img src="https://github.com/user-attachments/assets/a768e6b3-29c5-498d-83ae-d5e345fa2679" width="20">,
    <span>Tailwind CSS</span> <img src="https://github.com/user-attachments/assets/0c85a8a3-db4c-45f6-b82b-c33c7183bcef" width="20">,
    <span>shadcn/ui</span> <img src="https://github.com/user-attachments/assets/8ed2d72b-97ed-4925-ad48-268e51079f63" width="20">,
  </div>

- Datebase: Supabase (PostgreSQL Database, Auth) <img src="https://github.com/user-attachments/assets/6d799136-0f23-48d7-8835-aa0622cb53a9" width="20">

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- [pnpm](https://pnpm.io/) used as the package manager
- [Supabase](https://supabase.com/) project with API key (used for authentication/data storage)
- [Spotify API](https://developer.spotify.com/) project with client ID and secret (used for getting music metadata)
- `.env` file with URLs and API keys (e.g., Supabase, Spotify, etc.)

### Installation
```bash
git clone https://github.com/allennguyen01/Jukeboxd.git
cd Jukeboxd # change directory to project
pnpm install # install dependencies
pnpm dev # view application in dev mode
```

### Environment Variables

Create a `.env` file in the root of the project and add the following:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_API_KEY=your-api-key
VITE_SPOTIFY_CLIENT_ID=your-client-id
VITE_SPOTIFY_CLIENT_SECRET=your-client-secret
```

## User Stories

- [x] User can register for an account storing their name, email/username and password then login to the app using their credentials
- [x] User can search up albums that go to their own separate page with details (cover art, artists, producers, release date, tracks in the album, etc.)
- [x] User has a profile that displays the ratings and reviews they have uploaded
- [x] User can write a review or rate music on the separate music pages

### Bonus features

- [ ] User can create a post about a song/album with a caption
- [ ] User can follow other users and see their posts
- [ ] User can write a comment on posts
- [ ] User can create a playlist and share that as a post (slide carousel)
- [ ] Posts have embedded 30 second song preview
- [ ] Users can get personalized recommendations based on their ratings and reviews
