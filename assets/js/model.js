const UserModel = {
  getUsers: function () {
    const users = localStorage.getItem("users");
    return users ? JSON.parse(users) : [];
  },

  saveUser: function (user) {
    const users = this.getUsers();

    if (users.some(u => u.email === user.email)) {
      return false;
    }

    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    return true;
  },

  loginUser: function (email, password) {
      const users = this.getUsers();
      const user = users.find(u => u.email === email && u.password === password);
      return user || null;
  }

};

const Auth = {
  getCurrentUser: function () {
    const userStr = localStorage.getItem("currentUser");
    return userStr ? JSON.parse(userStr) : null;
  }
};

const PostModel = {
  getPosts() {
    return JSON.parse(localStorage.getItem("posts") || "[]");
  },

  getPostById(postId) {
    return this.getPosts().find(post => post.id === postId);
  },

  savePost(post) {
    const posts = this.getPosts();
    posts.push(post);
    localStorage.setItem("posts", JSON.stringify(posts));
  },

  updatePost(postId, updatedFields) {
    const posts = this.getPosts();
    const index = posts.findIndex(p => p.id === postId);
    if (index === -1) return;
    posts[index] = { ...posts[index], ...updatedFields };
    localStorage.setItem("posts", JSON.stringify(posts));
  },

  deletePost(postId) {
    const posts = this.getPosts().filter(p => p.id !== postId);
    localStorage.setItem("posts", JSON.stringify(posts));

    const comments = JSON.parse(localStorage.getItem("comments") || "{}");
    delete comments[postId];
    localStorage.setItem("comments", JSON.stringify(comments));
  },

  getCommentsForPost(postId) {
    const comments = JSON.parse(localStorage.getItem("comments") || "{}");
    return comments[postId] || [];
  },

  saveComment(postId, comment) {
    const comments = JSON.parse(localStorage.getItem("comments") || "{}");
    if (!comments[postId]) comments[postId] = [];
    comments[postId].push(comment);
    localStorage.setItem("comments", JSON.stringify(comments));
  },

  updateComment(postId, index, newComment) {
    const comments = JSON.parse(localStorage.getItem("comments") || "{}");
    if (!comments[postId]) return;
    comments[postId][index] = newComment;
    localStorage.setItem("comments", JSON.stringify(comments));
  },

  deleteComment(postId, index) {
    const comments = JSON.parse(localStorage.getItem("comments") || "{}");
    if (!comments[postId]) return;
    comments[postId].splice(index, 1);
    localStorage.setItem("comments", JSON.stringify(comments));
  }
};