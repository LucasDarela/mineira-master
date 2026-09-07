import Image from "next/image";

const InstagramIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const MessageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
  </svg>
);

async function getInstagramPosts(username: string) {
  try {
    const res = await fetch(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`, {
      headers: {
        'x-ig-app-id': '936619743392459',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      },
      next: { revalidate: 3600 } // Tenta a cada 1 hora
    });
    
    if (!res.ok) return null;
    
    const data = await res.json();
    if (data?.status === "fail") return null; // Instagram bloqueou a requisição

    const edges = data?.data?.user?.edge_owner_to_timeline_media?.edges || [];
    if (edges.length === 0) return null;

    return edges.slice(0, 6).map((edge: any) => ({
      id: edge.node.id,
      image: edge.node.display_url,
      link: `https://www.instagram.com/p/${edge.node.shortcode}/`,
      likes: edge.node.edge_media_preview_like.count,
      comments: edge.node.edge_media_to_comment.count,
    }));
  } catch (error) {
    return null;
  }
}

export async function SectionInstagram() {
  const username = "mineiramaster";
  
  // Tenta puxar do Instagram
  let posts = await getInstagramPosts(username);

  // Se falhar (bloqueio do Instagram), usa o Fallback para o site não quebrar
  if (!posts) {
    posts = [
      { id: 1, image: "/images/hero1.jpg", link: "https://www.instagram.com/p/DbQT7dlJgrG/", likes: 124, comments: 12 },
      { id: 2, image: "/images/hero2.jpg", link: "https://www.instagram.com/p/DbQT7dlJgrG/", likes: 98, comments: 4 },
      { id: 3, image: "/images/player.jpg", link: "https://www.instagram.com/p/DbQT7dlJgrG/", likes: 215, comments: 33 },
      { id: 4, image: "/images/hero1.jpg", link: "https://www.instagram.com/p/DbQT7dlJgrG/", likes: 54, comments: 2 },
      { id: 5, image: "/images/hero2.jpg", link: "https://www.instagram.com/p/DbQT7dlJgrG/", likes: 300, comments: 45 },
      { id: 6, image: "/images/player.jpg", link: "https://www.instagram.com/p/DbQT7dlJgrG/", likes: 180, comments: 9 },
    ];
  }

  return (
    <section id="redes-sociais" className="py-20 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#001f3f] mb-4 uppercase flex items-center justify-center gap-3">
            <InstagramIcon className="text-pink-600" size={32} />
            Nosso Instagram
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Acompanhe nossos lances, bastidores, comemorações e o dia a dia do time.
          </p>
        </div>

        {/* Grade de 6 imagens, 3 por linha no desktop e 2 por linha no mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-4">
          {posts.map((post: any) => (
            <a 
              key={post.id} 
              href={post.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative group aspect-square overflow-hidden bg-gray-200 block rounded-md"
            >
              {/* Usando tag img nativa para evitar bloqueio de CDN do next/image */}
              <img 
                src={post.image} 
                alt="Instagram Post" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6 text-white font-bold">
                <div className="flex items-center gap-2"><HeartIcon /> {post.likes}</div>
                <div className="flex items-center gap-2"><MessageIcon /> {post.comments}</div>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-12">
          <a 
            href={`https://www.instagram.com/${username}/`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <InstagramIcon size={20} />
            Ver mais no Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
