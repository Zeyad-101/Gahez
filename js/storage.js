(function attachInterviewStorage(root) {
  const providerKey = 'interview-trainer.provider';
  const byokKeyName = 'interview-trainer.byokKey';
  const themeKey = 'interview-trainer.theme';
  const draftKey = 'interview-trainer.draft';

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
    getProvider() {
      const value = root.localStorage.getItem(providerKey);
      return value || 'puter';
    },
    saveProvider(provider) {
      root.localStorage.setItem(providerKey, String(provider || 'puter'));
    },

    getByokKey() {
      const persisted = root.localStorage.getItem(byokKeyName);
      if (persisted) {
        try { session.setItem(byokKeyName, persisted); } catch (error) {  }
        return persisted;
      }
      return session.getItem(byokKeyName) || '';
    },
    saveByokKey(key, options) {
      const value = String(key || '').trim();
      if (!value) { this.clearByokKey(); return; }
      try { session.setItem(byokKeyName, value); } catch (error) {  }
      if (options && options.persist) {
        root.localStorage.setItem(byokKeyName, value);
      } else {
        root.localStorage.removeItem(byokKeyName);
      }
    },
    clearByokKey() {
      try { session.removeItem(byokKeyName); } catch (error) {  }
      root.localStorage.removeItem(byokKeyName);
    },

    getTheme() {
      const value = root.localStorage.getItem(themeKey);
      return ['auto', 'light', 'dark'].includes(value) ? value : 'auto';
    },
    saveTheme(theme) {
      const value = ['auto', 'light', 'dark'].includes(theme) ? theme : 'auto';
      root.localStorage.setItem(themeKey, value);
    },

    getDraft() {
      try { return session.getItem(draftKey) || ''; } catch (error) { return ''; }
    },
    saveDraft(text) {
      const value = String(text || '');
      try { session.setItem(draftKey, value); } catch (error) {  }
    },
    clearDraft() {
      try { session.removeItem(draftKey); } catch (error) {  }
    }
  };
}(globalThis));
