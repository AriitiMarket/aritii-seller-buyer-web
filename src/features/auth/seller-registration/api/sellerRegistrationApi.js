import api from '@/services/api';

const unwrap = (response) => response.data?.data || response.data;

export const sellerRegistrationApi = {
  async getMine() {
    const result = unwrap(await api.get('/seller-application/me'));
    return result.application || null;
  },

  async saveDraft(application) {
    const result = unwrap(await api.post('/seller-application', {
      ...application,
      submit: false,
    }));
    return result.application;
  },

  async submit(application) {
    const result = unwrap(await api.post('/seller-application', {
      ...application,
      submit: true,
    }));
    return result.application;
  },

  /** Throw away an abandoned DRAFT (the backend refuses any other status). */
  async discardDraft() {
    return unwrap(await api.delete('/seller-application/me'));
  },
};

export default sellerRegistrationApi;
