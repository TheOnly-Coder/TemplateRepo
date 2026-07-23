/**
 * RepoWeb Template — My First Site JavaScript
 * This script demonstrates how sites can use RepoWeb's injected data
 * and interact with the 3-tier data system.
 */

(function () {
  'use strict';

  // ─── Access data injected by RepoWeb ───
  const siteData = window.__repoweb_data || {};

  // ─── Render Users from data/users.json ───
  function renderUsers() {
    const container = document.getElementById('users-list');
    if (!container) return;

    try {
      const usersRaw = siteData['data/users.json'];
      if (!usersRaw) {
        container.innerHTML = '<p class="placeholder">No users.json found</p>';
        return;
      }
      const users = typeof usersRaw === 'string' ? JSON.parse(usersRaw) : usersRaw;

      if (!Array.isArray(users) || users.length === 0) {
        container.innerHTML = '<p class="placeholder">No users found</p>';
        return;
      }

      container.innerHTML = users
        .map(
          (u) => `
        <div class="user-item">
          <span class="name">${escapeHtml(u.name || 'Unknown')}</span>
          <span class="role">${escapeHtml(u.role || 'Member')}</span>
        </div>
      `
        )
        .join('');
    } catch (e) {
      container.innerHTML = '<p class="placeholder">Error parsing users data</p>';
    }
  }

  // ─── Render Posts from data/posts.json ───
  function renderPosts() {
    const container = document.getElementById('posts-list');
    if (!container) return;

    try {
      const postsRaw = siteData['data/posts.json'];
      if (!postsRaw) {
        container.innerHTML = '<p class="placeholder">No posts.json found</p>';
        return;
      }
      const posts = typeof postsRaw === 'string' ? JSON.parse(postsRaw) : postsRaw;

      if (!Array.isArray(posts) || posts.length === 0) {
        container.innerHTML = '<p class="placeholder">No posts found</p>';
        return;
      }

      container.innerHTML = posts
        .map(
          (p) => `
        <div class="post-item">
          <span class="post-title">${escapeHtml(p.title || 'Untitled')}</span>
          <span class="post-author">by ${escapeHtml(p.author || 'Unknown')}</span>
        </div>
      `
        )
        .join('');
    } catch (e) {
      container.innerHTML = '<p class="placeholder">Error parsing posts data</p>';
    }
  }

  // ─── Dynamic Actions (Tier 1 JSON Editing) ───
  function setupActions() {
    const addUserBtn = document.getElementById('add-user-btn');
    const addPostBtn = document.getElementById('add-post-btn');
    const statusEl = document.getElementById('action-status');

    if (addUserBtn) {
      addUserBtn.addEventListener('click', () => {
        const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];
        const roles = ['Admin', 'Editor', 'Viewer', 'Contributor'];
        const name = names[Math.floor(Math.random() * names.length)];
        const role = roles[Math.floor(Math.random() * roles.length)];

        // Notify RepoWeb parent to push JSON edit
        if (window.parent !== window) {
          window.parent.postMessage(
            {
              type: 'repoweb:jsonEdit',
              filePath: 'data/users.json',
              edit: { type: 'push', path: '', value: { name, role, joined: new Date().toISOString().split('T')[0] } },
            },
            '*'
          );
        }

        // Optimistic local update
        const usersList = document.getElementById('users-list');
        if (usersList) {
          const placeholder = usersList.querySelector('.placeholder');
          if (placeholder) placeholder.remove();
          usersList.insertAdjacentHTML(
            'beforeend',
            `<div class="user-item" style="opacity:0.6;border-left:2px solid var(--accent)">
              <span class="name">${name} (pending)</span>
              <span class="role">${role}</span>
            </div>`
          );
        }

        showStatus(statusEl, `User "${name}" added (pushing to GitHub...)`, 'success');
      });
    }

    if (addPostBtn) {
      addPostBtn.addEventListener('click', () => {
        const titles = ['Hello RepoWeb!', 'My First Decentralized Post', 'GitHub Sites Are Cool', 'No Server Needed'];
        const authors = ['Alice', 'Bob', 'RepoWeb Bot'];
        const title = titles[Math.floor(Math.random() * titles.length)];
        const author = authors[Math.floor(Math.random() * authors.length)];

        if (window.parent !== window) {
          window.parent.postMessage(
            {
              type: 'repoweb:jsonEdit',
              filePath: 'data/posts.json',
              edit: { type: 'push', path: '', value: { title, author, date: new Date().toISOString().split('T')[0] } },
            },
            '*'
          );
        }

        const postsList = document.getElementById('posts-list');
        if (postsList) {
          const placeholder = postsList.querySelector('.placeholder');
          if (placeholder) placeholder.remove();
          postsList.insertAdjacentHTML(
            'beforeend',
            `<div class="post-item" style="opacity:0.6;border-left:2px solid var(--accent)">
              <span class="post-title">${title} (pending)</span>
              <span class="post-author">by ${author}</span>
            </div>`
          );
        }

        showStatus(statusEl, `Post "${title}" created (pushing to GitHub...)`, 'success');
      });
    }
  }

  // ─── Helpers ───
  function showStatus(el, msg, type) {
    if (!el) return;
    el.textContent = msg;
    el.className = 'status-msg ' + (type || '');
    setTimeout(() => {
      el.textContent = '';
      el.className = 'status-msg';
    }, 4000);
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(String(str)));
    return div.innerHTML;
  }

  // ─── Init ───
  document.addEventListener('DOMContentLoaded', () => {
    renderUsers();
    renderPosts();
    setupActions();
  });
})();
