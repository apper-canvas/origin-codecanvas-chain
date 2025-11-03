import { toast } from 'react-toastify'

class PenService {
  constructor() {
    this.tableName = 'pen_c'
    this.apperClient = null
    this.initializeClient()
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
    }
  }

  async getAll() {
    try {
      if (!this.apperClient) {
        this.initializeClient()
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "html_c"}},
          {"field": {"Name": "css_c"}},
          {"field": {"Name": "javascript_c"}},
          {"field": {"Name": "thumbnail_c"}},
          {"field": {"Name": "views_c"}},
          {"field": {"Name": "likes_c"}},
          {"field": {"Name": "author_name_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "Tags"}}
        ],
        orderBy: [{"fieldName": "updated_at_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return (response.data || []).map(this.transformPenFromDatabase.bind(this))
    } catch (error) {
      console.error("Error fetching pens:", error?.response?.data?.message || error)
      toast.error("Failed to load pens")
      return []
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) {
        this.initializeClient()
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "html_c"}},
          {"field": {"Name": "css_c"}},
          {"field": {"Name": "javascript_c"}},
          {"field": {"Name": "thumbnail_c"}},
          {"field": {"Name": "views_c"}},
          {"field": {"Name": "likes_c"}},
          {"field": {"Name": "author_name_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "Tags"}}
        ]
      }

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params)

      if (!response.success) {
        console.error(response.message)
        return null
      }

      return response.data ? this.transformPenFromDatabase(response.data) : null
    } catch (error) {
      console.error(`Error fetching pen ${id}:`, error?.response?.data?.message || error)
      return null
    }
  }

  async getTrending() {
    try {
      if (!this.apperClient) {
        this.initializeClient()
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "html_c"}},
          {"field": {"Name": "css_c"}},
          {"field": {"Name": "javascript_c"}},
          {"field": {"Name": "thumbnail_c"}},
          {"field": {"Name": "views_c"}},
          {"field": {"Name": "likes_c"}},
          {"field": {"Name": "author_name_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "Tags"}}
        ],
        orderBy: [{"fieldName": "views_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 10, "offset": 0}
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return (response.data || []).map(this.transformPenFromDatabase.bind(this))
    } catch (error) {
      console.error("Error fetching trending pens:", error?.response?.data?.message || error)
      toast.error("Failed to load trending pens")
      return []
    }
  }

  async search(query, options = {}) {
    try {
      if (!this.apperClient) {
        this.initializeClient()
      }

      if (!query.trim()) return []
      
      const { sortBy = "recent", filterBy = "all" } = options
      const searchTerm = query.toLowerCase()
      
      let whereConditions = []
      
      switch (filterBy) {
        case "title":
          whereConditions = [{"FieldName": "title_c", "Operator": "Contains", "Values": [searchTerm]}]
          break
        case "author":
          whereConditions = [{"FieldName": "author_name_c", "Operator": "Contains", "Values": [searchTerm]}]
          break
        case "tags":
          whereConditions = [{"FieldName": "Tags", "Operator": "Contains", "Values": [searchTerm]}]
          break
        case "all":
        default:
          whereConditions = [{
            "operator": "OR",
            "subGroups": [
              {
                "conditions": [
                  {"fieldName": "title_c", "operator": "Contains", "values": [searchTerm]},
                  {"fieldName": "author_name_c", "operator": "Contains", "values": [searchTerm]},
                  {"fieldName": "Tags", "operator": "Contains", "values": [searchTerm]}
                ],
                "operator": "OR"
              }
            ]
          }]
          break
      }

      let orderBy = [{"fieldName": "created_at_c", "sorttype": "DESC"}]
      
      switch (sortBy) {
        case "popular":
          orderBy = [{"fieldName": "likes_c", "sorttype": "DESC"}]
          break
        case "views":
          orderBy = [{"fieldName": "views_c", "sorttype": "DESC"}]
          break
        case "likes":
          orderBy = [{"fieldName": "likes_c", "sorttype": "DESC"}]
          break
        case "recent":
        default:
          orderBy = [{"fieldName": "created_at_c", "sorttype": "DESC"}]
          break
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "html_c"}},
          {"field": {"Name": "css_c"}},
          {"field": {"Name": "javascript_c"}},
          {"field": {"Name": "thumbnail_c"}},
          {"field": {"Name": "views_c"}},
          {"field": {"Name": "likes_c"}},
          {"field": {"Name": "author_name_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "Tags"}}
        ],
        where: filterBy === "all" ? [] : whereConditions,
        whereGroups: filterBy === "all" ? whereConditions : [],
        orderBy: orderBy,
        pagingInfo: {"limit": 50, "offset": 0}
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      const results = (response.data || []).map(this.transformPenFromDatabase.bind(this))
      
      // Add generated tags for display
      return results.map(pen => ({
        ...pen,
        tags: this.generateTags(pen)
      }))
    } catch (error) {
      console.error("Error searching pens:", error?.response?.data?.message || error)
      toast.error("Failed to search pens")
      return []
    }
  }

  generateTags(pen) {
    const tags = []
    const title = pen.title_c?.toLowerCase() || ""
    
    // Generate tags based on pen content
    if (title.includes('css')) tags.push('CSS')
    if (title.includes('javascript') || title.includes('js')) tags.push('JavaScript')
    if (title.includes('html')) tags.push('HTML')
    if (title.includes('animation')) tags.push('Animation')
    if (title.includes('hover')) tags.push('Hover Effects')
    if (title.includes('button')) tags.push('Buttons')
    if (title.includes('card')) tags.push('Cards')
    if (title.includes('grid')) tags.push('Grid Layout')
    if (title.includes('canvas')) tags.push('Canvas')
    if (title.includes('particle')) tags.push('Particles')
    if (title.includes('color')) tags.push('Colors')
    if (title.includes('gradient')) tags.push('Gradients')
    if (title.includes('morph')) tags.push('Morphing')
    if (title.includes('glass')) tags.push('Glassmorphism')
    if (title.includes('weather')) tags.push('Weather')
    if (title.includes('dashboard')) tags.push('Dashboard')
    if (title.includes('interactive')) tags.push('Interactive')
    
    // Add some common tags
    const commonTags = ['UI', 'Design', 'Frontend', 'Creative', 'Modern']
    tags.push(...commonTags.slice(0, Math.floor(Math.random() * 3) + 1))
    
    return [...new Set(tags)] // Remove duplicates
  }

  async create(penData) {
    try {
      if (!this.apperClient) {
        this.initializeClient()
      }

      const now = new Date().toISOString()
      
      const params = {
        records: [{
          title_c: penData.title || "Untitled Pen",
          html_c: penData.html || "",
          css_c: penData.css || "",
          javascript_c: penData.javascript || "",
          views_c: 0,
          likes_c: 0,
          author_name_c: "Anonymous",
          created_at_c: now,
          updated_at_c: now,
          Name: penData.title || "Untitled Pen"
        }]
      }

      const response = await this.apperClient.createRecord(this.tableName, params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:${JSON.stringify(failed)}`)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          const createdRecord = successful[0].data
          toast.success("Pen created successfully!")
          return this.transformPenFromDatabase(createdRecord)
        }
      }

      return null
    } catch (error) {
      console.error("Error creating pen:", error?.response?.data?.message || error)
      toast.error("Failed to create pen")
      return null
    }
  }

  async update(id, penData) {
    try {
      if (!this.apperClient) {
        this.initializeClient()
      }

      const updateData = {
        Id: parseInt(id)
      }

      // Only include updateable fields that have values
      if (penData.title !== undefined) updateData.title_c = penData.title
      if (penData.html !== undefined) updateData.html_c = penData.html
      if (penData.css !== undefined) updateData.css_c = penData.css
      if (penData.javascript !== undefined) updateData.javascript_c = penData.javascript
      if (penData.views !== undefined) updateData.views_c = penData.views
      if (penData.likes !== undefined) updateData.likes_c = penData.likes
      
      updateData.updated_at_c = new Date().toISOString()
      if (penData.title) updateData.Name = penData.title

      const params = {
        records: [updateData]
      }

      const response = await this.apperClient.updateRecord(this.tableName, params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:${JSON.stringify(failed)}`)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          const updatedRecord = successful[0].data
          toast.success("Pen updated successfully!")
          return this.transformPenFromDatabase(updatedRecord)
        }
      }

      return null
    } catch (error) {
      console.error("Error updating pen:", error?.response?.data?.message || error)
      toast.error("Failed to update pen")
      return null
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) {
        this.initializeClient()
      }

      const params = {
        RecordIds: [parseInt(id)]
      }

      const response = await this.apperClient.deleteRecord(this.tableName, params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:${JSON.stringify(failed)}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success("Pen deleted successfully!")
          return true
        }
      }

      return false
    } catch (error) {
      console.error("Error deleting pen:", error?.response?.data?.message || error)
      toast.error("Failed to delete pen")
      return false
    }
  }

  async likePen(id) {
    try {
      if (!this.apperClient) {
        this.initializeClient()
      }

      // First get the current pen to increment likes
      const currentPen = await this.getById(id)
      if (!currentPen) return null

      const updatedLikes = (currentPen.likes_c || 0) + 1
      
      const params = {
        records: [{
          Id: parseInt(id),
          likes_c: updatedLikes,
          updated_at_c: new Date().toISOString()
        }]
      }

      const response = await this.apperClient.updateRecord(this.tableName, params)

      if (!response.success) {
        console.error(response.message)
        return currentPen
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        
        if (successful.length > 0) {
          return this.transformPenFromDatabase(successful[0].data)
        }
      }

      return currentPen
    } catch (error) {
      console.error("Error liking pen:", error?.response?.data?.message || error)
      return null
    }
  }

  async viewPen(id) {
    try {
      if (!this.apperClient) {
        this.initializeClient()
      }

      // First get the current pen to increment views
      const currentPen = await this.getById(id)
      if (!currentPen) return null

      const updatedViews = (currentPen.views_c || 0) + 1
      
      const params = {
        records: [{
          Id: parseInt(id),
          views_c: updatedViews,
          updated_at_c: new Date().toISOString()
        }]
      }

      const response = await this.apperClient.updateRecord(this.tableName, params)

      if (!response.success) {
        console.error(response.message)
        return currentPen
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        
        if (successful.length > 0) {
          return this.transformPenFromDatabase(successful[0].data)
        }
      }

      return currentPen
    } catch (error) {
      console.error("Error incrementing pen views:", error?.response?.data?.message || error)
      return null
    }
  }

  // Transform database record to match expected UI format
  transformPenFromDatabase(record) {
    return {
      Id: record.Id,
      title: record.title_c || record.Name || "Untitled Pen",
      title_c: record.title_c || record.Name || "Untitled Pen",
      html: record.html_c || "",
      html_c: record.html_c || "",
      css: record.css_c || "",
      css_c: record.css_c || "",
      javascript: record.javascript_c || "",
      javascript_c: record.javascript_c || "",
      thumbnail: record.thumbnail_c || null,
      thumbnail_c: record.thumbnail_c || null,
      views: record.views_c || 0,
      views_c: record.views_c || 0,
      likes: record.likes_c || 0,
      likes_c: record.likes_c || 0,
      author: {
        name: record.author_name_c || "Anonymous",
        avatar: null,
        id: "user"
      },
      author_name: record.author_name_c || "Anonymous",
      author_name_c: record.author_name_c || "Anonymous",
      createdAt: record.created_at_c || new Date().toISOString(),
      created_at_c: record.created_at_c || new Date().toISOString(),
      updatedAt: record.updated_at_c || new Date().toISOString(),
      updated_at_c: record.updated_at_c || new Date().toISOString(),
      tags: record.Tags ? record.Tags.split(',').map(tag => tag.trim()) : []
    }
  }
}

export default new PenService()