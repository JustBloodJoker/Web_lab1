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
    const posts = this.getPosts();
    return posts.find(post => post.id === postId);
  },

  savePost(post) {
    const posts = this.getPosts();
    posts.push(post);
    localStorage.setItem("posts", JSON.stringify(posts));
  },

  getCommentsForPost(postId) {
    const comments = JSON.parse(localStorage.getItem("comments") || "{}");
    return comments[postId] || [];
  },

  saveComment(postId, comment) {
    const comments = JSON.parse(localStorage.getItem("comments") || "{}");
    if (!comments[postId]) {
      comments[postId] = [];
    }
    comments[postId].push(comment);
    localStorage.setItem("comments", JSON.stringify(comments));
  }
};