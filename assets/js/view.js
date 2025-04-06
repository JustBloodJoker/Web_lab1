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
  renderPost(post) {
    const container = document.querySelector("main");
    container.innerHTML = `
      <article class="border p-4 mb-4">
        <h2>${post.title}</h2>
        <p class="text-muted">Автор: ${post.author} | ${post.date}</p>
        <p>${post.content}</p>
      </article>

      <section>
        <h3>Коментарі</h3>
        <form id="comment-form">
            <div class="mb-3">
                <label for="comment" class="form-label">Залишити коментар</label>
                <textarea id="comment" class="form-control" rows="3" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Надіслати</button>
        </form>
        <div class="mt-4" id="comments-list"></div>
      </section>
    `;
  },

  renderComments(postId) {
    const commentsContainer = document.getElementById("comments-list");
    const postComments = PostModel.getCommentsForPost(postId);

    if (postComments.length === 0) {
      commentsContainer.innerHTML = `<p>Коментарів поки немає.</p>`;
      return;
    }

    commentsContainer.innerHTML = postComments.map(comment => `
      <div class="comment mb-3">
        <p><strong>${comment.author}:</strong> ${comment.text}</p>
        <small class="text-muted">${comment.date}</small>
      </div>
    `).join("");
  }
};