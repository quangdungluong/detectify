import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface DetectionResult {
  id: number;
  timestamp: string;
  num_people: number;
  image_path: string;
  original_filename: string;
  confidence?: number;
  processing_time?: number;
  image_width?: number;
  image_height?: number;
  details?: DetectionDetailResult[];
}

export interface DetectionDetailResult {
  id: number;
  detection_id: number;
  confidence: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  class_name: string;
  class_id: number;
}

export interface PaginationResult {
  total: number;
  page: number;
  limit: number;
  pages: number;
  data: DetectionResult[];
}

const api = {
  async uploadImage(file: File, confidence: number = 0.5): Promise<DetectionResult> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post<DetectionResult>(
      `${API_URL}/detection/detect?confidence=${confidence}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  },

  async uploadImageFromUrl(imageUrl: string, confidence: number = 0.5): Promise<DetectionResult> {
    const response = await axios.post<DetectionResult>(
      `${API_URL}/detection/detect-from-url?confidence=${confidence}`,
      { image_url: imageUrl }
    );

    return response.data;
  },

  async getDetections(
    page = 1,
    limit = 10,
    minPeople?: number,
    maxPeople?: number,
    search?: string
  ): Promise<PaginationResult> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (minPeople !== undefined) {
      params.append('min_people', minPeople.toString());
    }

    if (maxPeople !== undefined) {
      params.append('max_people', maxPeople.toString());
    }

    if (search) {
      params.append('search', search);
    }

    const response = await axios.get<PaginationResult>(`${API_URL}/detection/?${params}`);
    return response.data;
  },

  async getDetectionById(id: number): Promise<DetectionResult> {
    try {
      const response = await axios.get<DetectionResult>(`${API_URL}/detection/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching detection details:', error);
      throw error;
    }
  }
};

export default api;
