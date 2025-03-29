import { defineStore } from 'pinia';
import type { User } from '@/types/user';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  }),
  
  getters: {
    isAuthenticated(): boolean {
      return !!this.token;
    },
    
    isAdmin(): boolean {
      return this.user?.role === 'ADMIN';
    },
    
    currentUser(): User | null {
      return this.user;
    }
  },
  
  actions: {
    setUser(user: User | null) {
      this.user = user;
    },
    
    setToken(token: string | null) {
      this.token = token;
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    },
    
    async login(username: string, password: string) {
      this.loading = true;
      this.error = null;
      try {
        // 在实际应用中，这里应该调用API进行登录
        // 以下是模拟的登录逻辑
        const mockUsers = [
          { id: '1', username: 'admin', password: 'admin', name: '管理员', role: 'ADMIN' },
          { id: '2', username: 'user', password: 'user', name: '普通用户', role: 'USER' }
        ];
        
        const user = mockUsers.find(u => u.username === username && u.password === password);
        if (!user) {
          throw new Error('用户名或密码错误');
        }
        
        // 模拟获取令牌
        const token = `mock-token-${Date.now()}`;
        
        // 保存用户和令牌
        this.setUser({
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role,
          email: `${user.username}@example.com`,
          avatar: null
        });
        this.setToken(token);
        
        return true;
      } catch (error) {
        this.error = error instanceof Error ? error.message : '登录失败';
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    logout() {
      this.setUser(null);
      this.setToken(null);
    },
    
    async fetchUserProfile() {
      if (!this.token) return null;
      
      this.loading = true;
      this.error = null;
      try {
        // 在实际应用中，这里应该调用API获取用户信息
        // 以下是模拟的逻辑
        const userProfile = {
          id: '1',
          username: 'admin',
          name: '管理员',
          role: 'ADMIN',
          email: 'admin@example.com',
          avatar: null
        };
        
        this.setUser(userProfile);
        return userProfile;
      } catch (error) {
        this.error = error instanceof Error ? error.message : '获取用户信息失败';
        return null;
      } finally {
        this.loading = false;
      }
    }
  }
});