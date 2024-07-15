document.addEventListener('DOMContentLoaded', () => {
    const handleNewPostForm = () => {
        const adminForm = document.getElementById('new-post-form');

        if (adminForm) {
            adminForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                const title = adminForm.querySelector('#post-title').value;
                const content = adminForm.querySelector('#post-content').value;

                try {
                    const response = await fetch('http://localhost:3000/api/add-post', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ title, content }),
                    });

                    if (!response.ok) {
                        throw new Error('Wystąpił problem podczas dodawania wpisu');
                    }

                    alert('Wpis dodany pomyślnie');
                    adminForm.reset();

                    // Odśwież listę wpisów po dodaniu nowego
                    fetchPosts();
                } catch (error) {
                    console.error('Błąd podczas dodawania wpisu:', error.message);
                }
            });
        }
    };

    const fetchPosts = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/get-posts');
            if (!response.ok) {
                throw new Error('Wystąpił problem podczas pobierania wpisów');
            }

            const posts = await response.json();
            displayPosts(posts);
        } catch (error) {
            console.error('Błąd podczas pobierania wpisów:', error.message);
        }
    };

    const displayPosts = (posts) => {
        const blogSection = document.getElementById('blog');
        const blogContainer = blogSection.querySelector('article');

        // Wyczyść poprzednie wpisy
        blogContainer.innerHTML = '';

        // Dodaj nowe wpisy
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content}</p>
            `;
            blogContainer.appendChild(postElement);
        });
    };

    handleNewPostForm();
    fetchPosts();
});
