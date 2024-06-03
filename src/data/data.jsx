const users = [
    {
        nickname: 'user1',
        email: 'user1@example.com',
        password: 'password1'
    },
    {
        nickname: 'user2',
        email: 'user2@example.com',
        password: 'password2'
    }
];

const posts = [
    {
        id: 1,
        title: 'First Post',
        content: 'This is the content of the first post.',
        author: 'user1',
        imageUrl: ['https://img.siksinhot.com/seeon/1716954228146074.jpg', 'https://img.siksinhot.com/seeon/1716954228146074.jpg'],
        createdAt: '2024-06-02T12:30:00Z', // 작성일자
        updatedAt: '2024-06-02T13:45:00Z' // 수정일자
    },
    {
        id: 2,
        title: 'Second Post',
        content: 'This is the content of the second post.',
        author: 'user2',
        imageUrl: ['https://img.siksinhot.com/seeon/1716954228146074.jpg', 'https://img.siksinhot.com/seeon/1716954228146074.jpg'],
        createdAt: '2024-06-01T09:15:00Z',
        updatedAt: '2024-06-02T11:20:00Z'
    },
    {
        id: 3,
        title: 'Third Post',
        content: 'This is the content of the third post.',
        author: 'user1',
        imageUrl: ['https://img.siksinhot.com/seeon/1716954228146074.jpg', 'https://img.siksinhot.com/seeon/1716954228146074.jpg'],
        createdAt: '2024-06-01T14:20:00Z',
        updatedAt: '2024-06-02T10:30:00Z'
    },
    {
        id: 4,
        title: 'Fourth Post',
        content: 'This is the content of the fourth post.',
        author: 'user2',
        imageUrl: ['https://img.siksinhot.com/seeon/1716954228146074.jpg', 'https://img.siksinhot.com/seeon/1716954228146074.jpg'],
        createdAt: '2024-06-02T08:45:00Z',
        updatedAt: '2024-06-02T09:55:00Z'
    },
    {
        id: 5,
        title: 'Fifth Post',
        content: 'This is the content of the fifth post.',
        author: 'user1',
        imageUrl: ['https://img.siksinhot.com/seeon/1716954228146074.jpg', 'https://img.siksinhot.com/seeon/1716954228146074.jpg'],
        createdAt: '2024-06-01T18:00:00Z',
        updatedAt: '2024-06-02T14:25:00Z'
    },
    {
        id: 6,
        title: 'Sixth Post',
        content: 'This is the content of the sixth post.',
        author: 'user2',
        imageUrl: ['https://img.siksinhot.com/seeon/1716954228146074.jpg', 'https://img.siksinhot.com/seeon/1716954228146074.jpg'],
        createdAt: '2024-06-02T11:10:00Z',
        updatedAt: '2024-06-02T13:00:00Z'
    },
    {
        id: 7,
        title: 'Seventh Post',
        content: 'This is the content of the seventh post.',
        author: 'user1',
        imageUrl: ['https://img.siksinhot.com/seeon/1716954228146074.jpg', 'https://img.siksinhot.com/seeon/1716954228146074.jpg'],
        createdAt: '2024-06-01T15:40:00Z',
        updatedAt: '2024-06-02T12:15:00Z'
    },
    {
        id: 8,
        title: 'Eighth Post',
        content: 'This is the content of the eighth post.',
        author: 'user2',
        imageUrl: ['https://img.siksinhot.com/seeon/1716954228146074.jpg', 'https://img.siksinhot.com/seeon/1716954228146074.jpg'],
        createdAt: '2024-06-02T10:05:00Z',
        updatedAt: '2024-06-02T11:30:00Z'
    },
    {
        id: 9,
        title: 'Ninth Post',
        content: 'This is the content of the ninth post.',
        author: 'user1',
        imageUrl: ['https://img.siksinhot.com/seeon/1716954228146074.jpg', 'https://img.siksinhot.com/seeon/1716954228146074.jpg'],
        createdAt: '2024-06-01T17:20:00Z',
        updatedAt: '2024-06-02T09:40:00Z'
    },
    {
        id: 10,
        title: 'Tenth Post',
        content: 'This is the content of the tenth post.',
        author: 'user2',
        imageUrl: ['https://img.siksinhot.com/seeon/1716954228146074.jpg', 'https://img.siksinhot.com/seeon/1716954228146074.jpg'],
        createdAt: '2024-06-02T09:50:00Z',
        updatedAt: '2024-06-02T15:20:00Z'
    }
];


// const a = {
//     'data': {
//         "nickname": "이길현",
//         "postId": "4",
//         "title": "제목",
//         "content": "내용",
//         'region': '지역',
//         "llkes": "좋아요 수",
//         "image": "url",
//         "createdAt": "생성일시",
//         "updatedAt": "수정일시",
//         'connten':
//             [
//                 {
//                     "connentId": "3",
//                     "nickname": "이길현",
//                     "content": "맛있는 맛집 추천 감사합니다.",
//                     "createdAt": "날짜",
//                     "updatedAt": "날짜"
//                 },
//                 {
//                     "connentId": "4",
//                     "nickname": "김만규",
//                     "content": "여기 저도 가봤는데 맛있어요.",
//                     "createdAt": "날짜",
//                     "updatedAt": "날짜"
//                 },
//             ]
//     }
// }
export { users, posts};
