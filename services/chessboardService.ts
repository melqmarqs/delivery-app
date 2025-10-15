import axios from "axios"

export const ChessboardService = {
  async getGraph() {
    const resp = await axios.get('https://dummyjson.com/c/bca7-e641-479c-9572');
    return resp.data;
  }
}