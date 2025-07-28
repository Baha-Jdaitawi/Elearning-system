import axios from './api';

export const certificateAPI = {
  generate: async (userId, courseId) => {
    const response = await axios.get(`/certificates/generate/${userId}/${courseId}`, {
      responseType: 'blob' 
    });
    return response;
  }
};

