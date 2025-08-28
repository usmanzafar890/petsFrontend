// Enhanced storage utilities with offline-first approach
export class OfflineStorage<T extends { id: string }> {
  private key: string
  private syncQueue: string[] = []

  constructor(key: string) {
    this.key = key
    this.loadSyncQueue()
  }

  private loadSyncQueue(): void {
    try {
      const queue = localStorage.getItem(`${this.key}_sync_queue`)
      this.syncQueue = queue ? JSON.parse(queue) : []
    } catch (error) {
      console.error(`[v0] Failed to load sync queue for ${this.key}:`, error)
      this.syncQueue = []
    }
  }

  private saveSyncQueue(): void {
    try {
      localStorage.setItem(`${this.key}_sync_queue`, JSON.stringify(this.syncQueue))
    } catch (error) {
      console.error(`[v0] Failed to save sync queue for ${this.key}:`, error)
    }
  }

  getAll(): T[] {
    try {
      const data = localStorage.getItem(this.key)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error(`[v0] Failed to load data from ${this.key}:`, error)
      return []
    }
  }

  save(item: T): void {
    try {
      const items = this.getAll()
      const existingIndex = items.findIndex((i) => i.id === item.id)

      if (existingIndex >= 0) {
        items[existingIndex] = item
      } else {
        items.push(item)
      }

      localStorage.setItem(this.key, JSON.stringify(items))

      // Add to sync queue for future online sync
      if (!this.syncQueue.includes(item.id)) {
        this.syncQueue.push(item.id)
        this.saveSyncQueue()
      }

      // Dispatch custom event for real-time updates
      window.dispatchEvent(new CustomEvent(`${this.key}_updated`, { detail: item }))
    } catch (error) {
      console.error(`[v0] Failed to save data to ${this.key}:`, error)
    }
  }

  delete(id: string): void {
    try {
      const items = this.getAll().filter((item) => item.id !== id)
      localStorage.setItem(this.key, JSON.stringify(items))

      // Remove from sync queue
      this.syncQueue = this.syncQueue.filter((queueId) => queueId !== id)
      this.saveSyncQueue()

      // Dispatch custom event
      window.dispatchEvent(new CustomEvent(`${this.key}_deleted`, { detail: { id } }))
    } catch (error) {
      console.error(`[v0] Failed to delete data from ${this.key}:`, error)
    }
  }

  getPendingSyncItems(): T[] {
    const allItems = this.getAll()
    return allItems.filter((item) => this.syncQueue.includes(item.id))
  }

  clearSyncQueue(): void {
    this.syncQueue = []
    this.saveSyncQueue()
  }

  // Get storage usage info
  getStorageInfo(): { used: number; available: number; percentage: number } {
    try {
      let used = 0
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length + key.length
        }
      }

      // Estimate available space (5MB typical limit)
      const available = 5 * 1024 * 1024 - used
      const percentage = (used / (5 * 1024 * 1024)) * 100

      return { used, available, percentage }
    } catch (error) {
      console.error("[v0] Failed to get storage info:", error)
      return { used: 0, available: 0, percentage: 0 }
    }
  }
}
