const RegisterView = {
  showAlert: function (message, type = "danger") {
    let oldAlert = document.getElementById("form-alert");
    if (oldAlert) oldAlert.remove();

    const alert = document.createElement("div");
    alert.className = `alert alert-${type} mt-3`;
    alert.id = "form-alert";
    alert.textContent = message;

    const form = document.querySelector("form");
    form.appendChild(alert);
  }
};

const LoginView = {
  showAlert: function (message, type = "danger") {
    let oldAlert = document.getElementById("form-alert");
    if (oldAlert) oldAlert.remove();

    const alert = document.createElement("div");
    alert.className = `alert alert-${type} mt-3`;
    alert.id = "form-alert";
    alert.textContent = message;

    const form = document.querySelector("form");
    form.appendChild(alert);
  }
};

const ProfileView = {
  render: function (user) {
    const rows = `
      <tr><td>Ім’я</td><td>${user.name}</td></tr>
      <tr><td>Email</td><td>${user.email}</td></tr>
      <tr><td>Стать</td><td>${this.translateGender(user.gender)}</td></tr>
      <tr><td>Дата народження</td><td>${this.formatDate(user.birthdate)}</td></tr>
    `;
    document.querySelector("tbody").innerHTML = rows;
  },

  translateGender: function (gender) {
    switch (gender) {
      case "male": return "Чоловіча";
      case "female": return "Жіноча";
      case "other": return "Інше";
      default: return "Невідомо";
    }
  },

  formatDate: function (dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("uk-UA");
  }
};

const CreatePostView = {
  showAlert: function (message, type = "danger") {
    let oldAlert = document.getElementById("form-alert");
    if (oldAlert) oldAlert.remove();

    const alert = document.createElement("div");
    alert.className = `alert alert-${type} mt-3`;
    alert.id = "form-alert";
    alert.textContent = message;

    const form = document.querySelector("form");
    form.appendChild(alert);
  }
};

const BlogView = {
  renderPosts: function (posts) {
    const container = document.getElementById("postList");
    container.innerHTML = "";

    if (posts.length === 0) {
      container.innerHTML = "<p>Поки що немає постів.</p>";
      return;
    }

    const list = document.createElement("ul");
    list.className = "list-group";

    posts.forEach((post) => {
      const item = document.createElement("li");
      item.className = "list-group-item";

      const link = document.createElement("a");
      link.href = `post.html?id=${post.id}`;
      link.className = "list-group-item list-group-item-action";

      link.innerHTML = `
        <h5 class="mb-1">${post.title}</h5>
        <small class="text-muted">Автор: ${post.author}, ${post.date}</small>
      `;

      item.appendChild(link);
      list.appendChild(item);
    });

    container.appendChild(list);
  },
};

const PostView = {
  renderPost(post, isAuthor) {
    const container = document.querySelector("article#post");

    container.innerHTML = `
      <h2>${post.title}</h2>
      <p class="text-muted">Автор: ${post.author} | ${post.date}</p>
      <p>${post.content}</p>
      ${isAuthor ? `
        <button class="btn btn-warning btn-sm me-2" id="edit-post">Редагувати</button>
        <button class="btn btn-danger btn-sm" id="delete-post">Видалити</button>
      ` : ""}
    `;
    
    document.getElementById("comments-section").style.display = "block";
  },

  bindPostActions(postId, isAuthor) {
    if (!isAuthor) return;

    document.getElementById("edit-post").addEventListener("click", () => {
      PostController.showEditPostForm(postId);
    });

    document.getElementById("delete-post").addEventListener("click", () => {
      PostController.deletePost(postId);
    });
  },

  renderEditPostForm(post) {
    const container = document.querySelector("article#post");
    container.innerHTML = `
      <h2>Редагувати пост</h2>
      <form id="edit-post-form">
        <div class="mb-3">
          <label class="form-label">Заголовок</label>
          <input type="text" class="form-control" id="edit-title" value="${post.title}" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Контент</label>
          <textarea class="form-control" id="edit-content" rows="5" required>${post.content}</textarea>
        </div>
        <button type="submit" class="btn btn-success">Зберегти</button>
      </form>
    `;
  },

  renderComments(comments, currentUser, postId) {
    const container = document.getElementById("comments-list");
    container.innerHTML = "";

    if (comments.length === 0) {
      container.innerHTML = `<p>Коментарів поки немає.</p>`;
      return;
    }

    comments.forEach((comment, index) => {
      const div = document.createElement("div");
      div.className = "comment mb-3";
      div.innerHTML = `
        <p><strong>${comment.author}:</strong> ${comment.text}</p>
        <small class="text-muted">${comment.date}</small>
        ${(currentUser && currentUser.name === comment.author) ? `
          <div class="mt-2">
            <button class="btn btn-sm btn-warning me-2" data-edit="${index}">Редагувати</button>
            <button class="btn btn-sm btn-danger" data-delete="${index}">Видалити</button>
          </div>` : ""}
      `;
      container.appendChild(div);
    });

    container.querySelectorAll("[data-edit]").forEach(btn => {
      btn.addEventListener("click", e => {
        PostController.editComment(postId, e.target.dataset.edit);
      });
    });

    container.querySelectorAll("[data-delete]").forEach(btn => {
      btn.addEventListener("click", e => {
        PostController.deleteComment(postId, e.target.dataset.delete);
      });
    });
  },

  renderEditCommentForm(comment, index) {
    const container = document.getElementById("comments-list");
    const commentDiv = container.children[index];

    commentDiv.innerHTML = `
      <textarea class="form-control mb-2" id="edit-comment-text" rows="2">${comment.text}</textarea>
      <button class="btn btn-sm btn-success me-2" id="save-comment">Зберегти</button>
      <button class="btn btn-sm btn-secondary" id="cancel-edit">Скасувати</button>
    `;
  },

  bindEditCommentActions(postId, index) {
    document.getElementById("save-comment").addEventListener("click", () => {
      const newText = document.getElementById("edit-comment-text").value.trim();
      if (!newText) return;
      PostController.saveEditedComment(postId, index, newText);
    });

    document.getElementById("cancel-edit").addEventListener("click", () => {
      PostView.renderComments(PostModel.getCommentsForPost(postId), Auth.getCurrentUser(), postId);
    });
  },
  
  renderPostNotFound() {
    const container = document.querySelector("article#post");
    container.innerHTML = `<p class="text-danger">Пост не знайдено</p>`;
    document.getElementById("comments-section").style.display = "none";
  }
};