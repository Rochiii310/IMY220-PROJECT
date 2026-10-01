export const currentUser = {
  id: 'u1',
  name: 'Test User',
  username: '@testuser',
  email: 'test@test.com',
  bio: 'Chasing golden hour, one frame at a time.',
  avatar: 'https://i.pravatar.cc/150?img=12',
  verified: true
}

export const users = [
  currentUser,
  {
    id: 'u2',
    name: 'Naledi Khumalo',
    username: '@naledi.k',
    email: 'naledi@example.com',
    bio: 'Street photography, Pretoria based.',
    avatar: 'https://i.pravatar.cc/150?img=32',
    verified: true
  },
  {
    id: 'u3',
    name: 'Sam Ortega',
    username: '@samo',
    email: 'sam@example.com',
    bio: 'Film shooter. Mostly 35mm.',
    avatar: 'https://i.pravatar.cc/150?img=15',
    verified: false
  }
]

export const friends = [users[1], users[2]]

export const comments = [
  { id: 'c1', userId: 'u2', text: 'This light is unreal.', createdAt: '2h ago' },
  { id: 'c2', userId: 'u3', text: 'Where was this taken?', createdAt: '1h ago' }
]

export const posts = [
  {
    id: 'p1',
    userId: 'u1',
    description: 'Sunset over the city skyline, shot on a rooftop downtown.',
    image: 'https://picsum.photos/id/1015/800/500',
    hashtags: ['#sunset', '#skyline'],
    likes: 24,
    createdAt: '3h ago',
    comments
  },
  {
    id: 'p2',
    userId: 'u2',
    description: 'Quiet morning market streets before the crowds arrive.',
    image: 'https://picsum.photos/id/1024/800/500',
    hashtags: ['#streetphotography', '#morning'],
    likes: 41,
    createdAt: '5h ago',
    comments: []
  },
  {
    id: 'p3',
    userId: 'u3',
    description: 'Old film roll, developed after two years in a drawer.',
    image: 'https://picsum.photos/id/1035/800/500',
    hashtags: ['#film', '#35mm'],
    likes: 12,
    createdAt: '1d ago',
    comments: []
  },
  {
    id: 'p4',
    userId: 'u1',
    description: 'Autumn leaves along the river path near campus.',
    image: 'https://picsum.photos/id/1043/800/500',
    hashtags: ['#autumn', '#nature'],
    likes: 8,
    createdAt: '1d ago',
    comments: []
  },
  {
    id: 'p5',
    userId: 'u2',
    description: 'Portrait study using only window light.',
    image: 'https://picsum.photos/id/1005/800/500',
    hashtags: ['#portrait'],
    likes: 33,
    createdAt: '2d ago',
    comments: []
  },
  {
    id: 'p6',
    userId: 'u3',
    description: 'Mountains at dawn, temperature dropped to -2.',
    image: 'https://picsum.photos/id/1018/800/500',
    hashtags: ['#landscape', '#mountains'],
    likes: 56,
    createdAt: '2d ago',
    comments: []
  },
  {
    id: 'p7',
    userId: 'u1',
    description: 'Coffee and a rainy window, a slow Sunday.',
    image: 'https://picsum.photos/id/225/800/500',
    hashtags: ['#coffee', '#rain'],
    likes: 19,
    createdAt: '3d ago',
    comments: []
  },
  {
    id: 'p8',
    userId: 'u2',
    description: 'Neon signs in the old part of town, long exposure.',
    image: 'https://picsum.photos/id/1039/800/500',
    hashtags: ['#neon', '#longexposure'],
    likes: 47,
    createdAt: '4d ago',
    comments: []
  },
  {
    id: 'p9',
    userId: 'u3',
    description: 'A quiet harbour before the boats head out.',
    image: 'https://picsum.photos/id/1050/800/500',
    hashtags: ['#harbour'],
    likes: 15,
    createdAt: '5d ago',
    comments: []
  },
  {
    id: 'p10',
    userId: 'u1',
    description: 'Wildflowers along the hiking trail this weekend.',
    image: 'https://picsum.photos/id/106/800/500',
    hashtags: ['#hiking', '#flowers'],
    likes: 29,
    createdAt: '6d ago',
    comments: []
  }
]

export const albums = [
  { id: 'a1', userId: 'u1', name: 'City Nights', description: 'Long exposures around town.' },
  { id: 'a2', userId: 'u1', name: 'Weekend Trails', description: 'Hikes and nature walks.' },
  { id: 'a3', userId: 'u2', name: 'Street Stories', description: 'Candid street photography.' },
  { id: 'a4', userId: 'u3', name: 'Film Rolls', description: 'Analog photography archive.' },
  { id: 'a5', userId: 'u2', name: 'Portraits', description: 'Natural light portrait studies.' }
]

export function getUserById(id) {
  return users.find((u) => u.id === id)
}
