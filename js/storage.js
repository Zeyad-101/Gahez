(function attachInterviewStorage(root) {
  const providerKey = 'interview-trainer.provider';
  const byokKeyName = 'interview-trainer.byokKey';
  const themeKey = 'interview-trainer.theme';
  const draftKey = 'interview-trainer.draft';

  // sessionStorage is not always available (private mode, sandboxed iframes).
  // Fall back to a no-op shim so callers can still call setItem/removeItem.
  function safeSession() {
    try {
      const probe = '__probe__';
      root.sessionStorage.setItem(probe, probe);
      root.sessionStorage.removeItem(probe);
      return root.sessionStorage;
    } catch (error) {
      return { getItem() { return null; }, setItem() {}, removeItem() {} };
    }
  }

  const session = safeSession();

  root.InterviewStorage = {
    // ----- Provider (localStorage; not sensitive) -----
    getProvider() {
      const value = root.localStorage.getItem(providerKey);
      return value || 'puter';
    },
    saveProvider(provider) {
      root.localStorage.setItem(providerKey, String(provider || 'puter'));
    },

    // ----- API key (sessionStorage by default; localStorage only when explicitly persisted) -----
    getByokKey() {
      const persisted = root.localStorage.getItem(byokKeyName);
      if (persisted) {
        // Mirror to sessionStorage so the current tab can keep using it without
        // round-tripping localStorage on every request.
        try { session.setItem(byokKeyName, persisted); } catch (error) { /* private mode */ }
        return persisted;
      }
      return session.getItem(byokKeyName) || '';
    },
    saveByokKey(key, options) {
      const value = String(key || '').trim();
      if (!value) { this.clearByokKey(); return; }
      try { session.setItem(byokKeyName, value); } catch (error) { /* private mode */ }
      if (options && options.persist) {
        root.localStorage.setItem(byokKeyName, value);
      } else {
        root.localStorage.removeItem(byokKeyName);
      }
    },
    clearByokKey() {
      try { session.removeItem(byokKeyName); } catch (error) { /* private mode */ }
      root.localStorage.removeItem(byokKeyName);
    },

    // ----- Theme (localStorage; not sensitive) -----
    getTheme() {
      const value = root.localStorage.getItem(themeKey);
      return ['auto', 'light', 'dark'].includes(value) ? value : 'auto';
    },
    saveTheme(theme) {
      const value = ['auto', 'light', 'dark'].includes(theme) ? theme : 'auto';
      root.localStorage.setItem(themeKey, value);
    },

    // ----- Draft answer (sessionStorage only; lost when tab closes) -----
    getDraft() {
      try { return session.getItem(draftKey) || ''; } catch (error) { return ''; }
    },
    saveDraft(text) {
      const value = String(text || '');
      try { session.setItem(draftKey, value); } catch (error) { /* private mode */ }
    },
    clearDraft() {
      try { session.removeItem(draftKey); } catch (error) { /* private mode */ }
    }
  };
}(globalThis));
