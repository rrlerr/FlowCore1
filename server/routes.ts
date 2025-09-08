import { createServer, type Server } from "http";
import type { Express } from "express";
import { storage } from "./storage";
import { 
  insertUserSchema, insertCompanySchema, insertLeadSchema, insertTicketSchema, insertDealSchema, 
  insertProjectSchema, insertTaskSchema, insertEmailSchema, insertUserRoleSchema, insertActivitySchema, insertReportSchema
} from "@shared/schema";
// Local AI assistant - no external APIs required
import { processLocalAIMessage } from "./localAI";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize basic user roles only (no dummy users)
  try {
    const roles = await storage.getUserRoles();
    if (roles.length === 0) {
      await storage.createUserRole({ name: "admin", description: "Full system access", permissions: ["*"] });
      await storage.createUserRole({ name: "manager", description: "Team management", permissions: ["read", "write", "manage_team"] });
      await storage.createUserRole({ name: "user", description: "Basic user access", permissions: ["read", "write"] });
    }
  } catch (error) {
    console.error("Failed to initialize user roles:", error);
  }

  // User role routes
  app.get("/api/user-roles", async (req, res) => {
    try {
      const roles = await storage.getUserRoles();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user roles" });
    }
  });

  // User routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userData = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(id, userData);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteUser(id);
      if (!success) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Company routes
  app.get("/api/companies", async (req, res) => {
    try {
      const companies = await storage.getCompanies();
      res.json(companies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch companies" });
    }
  });

  app.post("/api/companies", async (req, res) => {
    try {
      const companyData = insertCompanySchema.parse(req.body);
      const company = await storage.createCompany(companyData);
      res.json(company);
    } catch (error) {
      res.status(400).json({ message: "Invalid company data" });
    }
  });

  app.put("/api/companies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const companyData = insertCompanySchema.partial().parse(req.body);
      const company = await storage.updateCompany(id, companyData);
      if (!company) {
        res.status(404).json({ message: "Company not found" });
        return;
      }
      res.json(company);
    } catch (error) {
      res.status(400).json({ message: "Invalid company data" });
    }
  });

  app.delete("/api/companies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCompany(id);
      if (!success) {
        res.status(404).json({ message: "Company not found" });
        return;
      }
      res.json({ message: "Company deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete company" });
    }
  });

  // Lead routes
  app.get("/api/leads", async (req, res) => {
    try {
      const leads = await storage.getLeads();
      res.json(leads);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });

  app.get("/api/leads/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const lead = await storage.getLead(id);
      if (!lead) {
        res.status(404).json({ message: "Lead not found" });
        return;
      }
      res.json(lead);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lead" });
    }
  });

  app.post("/api/leads", async (req, res) => {
    try {
      const leadData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(leadData);
      res.json(lead);
    } catch (error) {
      res.status(400).json({ message: "Invalid lead data" });
    }
  });

  app.put("/api/leads/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const leadData = insertLeadSchema.partial().parse(req.body);
      const lead = await storage.updateLead(id, leadData);
      if (!lead) {
        res.status(404).json({ message: "Lead not found" });
        return;
      }
      res.json(lead);
    } catch (error) {
      res.status(400).json({ message: "Invalid lead data" });
    }
  });

  app.delete("/api/leads/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteLead(id);
      if (!success) {
        res.status(404).json({ message: "Lead not found" });
        return;
      }
      res.json({ message: "Lead deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete lead" });
    }
  });

  // Ticket routes
  app.get("/api/tickets", async (req, res) => {
    try {
      const tickets = await storage.getTickets();
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tickets" });
    }
  });

  app.get("/api/tickets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const ticket = await storage.getTicket(id);
      if (!ticket) {
        res.status(404).json({ message: "Ticket not found" });
        return;
      }
      res.json(ticket);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ticket" });
    }
  });

  app.post("/api/tickets", async (req, res) => {
    try {
      const ticketData = insertTicketSchema.parse(req.body);
      const ticket = await storage.createTicket(ticketData);
      res.json(ticket);
    } catch (error) {
      res.status(400).json({ message: "Invalid ticket data" });
    }
  });

  app.put("/api/tickets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const ticketData = insertTicketSchema.partial().parse(req.body);
      const ticket = await storage.updateTicket(id, ticketData);
      if (!ticket) {
        res.status(404).json({ message: "Ticket not found" });
        return;
      }
      res.json(ticket);
    } catch (error) {
      res.status(400).json({ message: "Invalid ticket data" });
    }
  });

  app.delete("/api/tickets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTicket(id);
      if (!success) {
        res.status(404).json({ message: "Ticket not found" });
        return;
      }
      res.json({ message: "Ticket deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete ticket" });
    }
  });

  // Deal routes
  app.get("/api/deals", async (req, res) => {
    try {
      const deals = await storage.getDeals();
      res.json(deals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch deals" });
    }
  });

  app.get("/api/deals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deal = await storage.getDeal(id);
      if (!deal) {
        res.status(404).json({ message: "Deal not found" });
        return;
      }
      res.json(deal);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch deal" });
    }
  });

  app.post("/api/deals", async (req, res) => {
    try {
      const dealData = insertDealSchema.parse(req.body);
      const deal = await storage.createDeal(dealData);
      res.json(deal);
    } catch (error) {
      res.status(400).json({ message: "Invalid deal data" });
    }
  });

  app.put("/api/deals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const dealData = insertDealSchema.partial().parse(req.body);
      const deal = await storage.updateDeal(id, dealData);
      if (!deal) {
        res.status(404).json({ message: "Deal not found" });
        return;
      }
      res.json(deal);
    } catch (error) {
      res.status(400).json({ message: "Invalid deal data" });
    }
  });

  app.delete("/api/deals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteDeal(id);
      if (!success) {
        res.status(404).json({ message: "Deal not found" });
        return;
      }
      res.json({ message: "Deal deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete deal" });
    }
  });

  // Project routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      if (!project) {
        res.status(404).json({ message: "Project not found" });
        return;
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const projectData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(id, projectData);
      if (!project) {
        res.status(404).json({ message: "Project not found" });
        return;
      }
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProject(id);
      if (!success) {
        res.status(404).json({ message: "Project not found" });
        return;
      }
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Task routes
  app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.get("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const task = await storage.getTask(id);
      if (!task) {
        res.status(404).json({ message: "Task not found" });
        return;
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch task" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(taskData);
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: "Invalid task data" });
    }
  });

  app.put("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const taskData = insertTaskSchema.partial().parse(req.body);
      const task = await storage.updateTask(id, taskData);
      if (!task) {
        res.status(404).json({ message: "Task not found" });
        return;
      }
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: "Invalid task data" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTask(id);
      if (!success) {
        res.status(404).json({ message: "Task not found" });
        return;
      }
      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // Email routes
  app.get("/api/emails", async (req, res) => {
    try {
      const emails = await storage.getEmails();
      res.json(emails);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch emails" });
    }
  });

  app.get("/api/emails/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const email = await storage.getEmail(id);
      if (!email) {
        res.status(404).json({ message: "Email not found" });
        return;
      }
      res.json(email);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch email" });
    }
  });

  app.post("/api/emails", async (req, res) => {
    try {
      const emailData = insertEmailSchema.parse(req.body);
      const email = await storage.createEmail(emailData);
      res.json(email);
    } catch (error) {
      res.status(400).json({ message: "Invalid email data" });
    }
  });

  app.put("/api/emails/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const emailData = insertEmailSchema.partial().parse(req.body);
      const email = await storage.updateEmail(id, emailData);
      if (!email) {
        res.status(404).json({ message: "Email not found" });
        return;
      }
      res.json(email);
    } catch (error) {
      res.status(400).json({ message: "Invalid email data" });
    }
  });

  app.delete("/api/emails/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteEmail(id);
      if (!success) {
        res.status(404).json({ message: "Email not found" });
        return;
      }
      res.json({ message: "Email deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete email" });
    }
  });

  // Search routes
  app.get("/api/search", async (req, res) => {
    try {
      const { q, type } = req.query;
      if (!q || typeof q !== "string") {
        res.status(400).json({ message: "Query parameter 'q' is required" });
        return;
      }

      let results: any = {};
      
      if (!type || type === "leads") {
        results.leads = await storage.searchLeads(q);
      }
      if (!type || type === "tickets") {
        results.tickets = await storage.searchTickets(q);
      }
      if (!type || type === "deals") {
        results.deals = await storage.searchDeals(q);
      }
      if (!type || type === "projects") {
        results.projects = await storage.searchProjects(q);
      }

      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Search failed" });
    }
  });

  // Local AI Assistant route - no external APIs required
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message) {
        res.status(400).json({ message: "Message is required" });
        return;
      }

      const result = await processLocalAIMessage(message.trim());
      res.json(result);
    } catch (error) {
      console.error("Local AI Chat error:", error);
      res.json({ 
        action: "respond", 
        message: "I'm sorry, I encountered an error. Please try again." 
      });
    }
  });

  // Enhanced stats route for dashboard
  app.get("/api/stats", async (req, res) => {
    try {
      const [leads, tickets, deals, projects, users] = await Promise.all([
        storage.getLeads(),
        storage.getTickets(),
        storage.getDeals(),
        storage.getProjects(),
        storage.getUsers()
      ]);

      const stats = {
        totalLeads: leads.length,
        activeTickets: tickets.filter(t => t.status !== "resolved").length,
        totalRevenue: deals.reduce((sum, deal) => sum + parseFloat(deal.value.toString()), 0),
        activeProjects: projects.filter(p => p.status === "active").length,
        totalUsers: users.length,
        recentActivity: [
          ...leads.slice(-3).map(lead => ({
            type: "lead",
            message: `New lead created: ${lead.name}`,
            timestamp: lead.createdAt
          })),
          ...tickets.slice(-3).map(ticket => ({
            type: "ticket",
            message: `Ticket ${ticket.status}: ${ticket.title}`,
            timestamp: ticket.updatedAt || ticket.createdAt
          })),
          ...deals.slice(-3).map(deal => ({
            type: "deal",
            message: `Deal ${deal.stage}: ${deal.title}`,
            timestamp: deal.createdAt
          }))
        ].sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()).slice(0, 10)
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Reminders endpoint
  app.get("/api/reminders", async (req, res) => {
    try {
      const reminders = [];
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

      // Check tickets with due dates
      const tickets = await storage.getTickets();
      for (const ticket of tickets) {
        if (ticket.dueDate && ticket.status !== 'resolved' && ticket.status !== 'closed') {
          const dueDate = new Date(ticket.dueDate);
          if (dueDate <= twoDaysFromNow) {
            reminders.push({
              id: `ticket-${ticket.id}`,
              type: 'ticket',
              title: `Ticket Due: ${ticket.title}`,
              description: `Ticket #${ticket.id} is due ${dueDate <= now ? 'now' : dueDate <= tomorrow ? 'tomorrow' : 'soon'}`,
              dueDate: ticket.dueDate,
              priority: dueDate <= now ? 'overdue' : dueDate <= tomorrow ? 'urgent' : 'upcoming',
              itemId: ticket.id
            });
          }
        }
      }

      // Check tasks with due dates
      const tasks = await storage.getTasks();
      for (const task of tasks) {
        if (task.dueDate && task.status !== 'completed' && task.status !== 'cancelled') {
          const dueDate = new Date(task.dueDate);
          if (dueDate <= twoDaysFromNow) {
            reminders.push({
              id: `task-${task.id}`,
              type: 'task',
              title: `Task Due: ${task.title}`,
              description: `Task "${task.title}" is due ${dueDate <= now ? 'now' : dueDate <= tomorrow ? 'tomorrow' : 'soon'}`,
              dueDate: task.dueDate,
              priority: dueDate <= now ? 'overdue' : dueDate <= tomorrow ? 'urgent' : 'upcoming',
              itemId: task.id
            });
          }
        }
      }

      // Check deals with expected close dates
      const deals = await storage.getDeals();
      for (const deal of deals) {
        if (deal.expectedCloseDate && deal.stage !== 'closed_won' && deal.stage !== 'closed_lost') {
          const closeDate = new Date(deal.expectedCloseDate);
          if (closeDate <= twoDaysFromNow) {
            reminders.push({
              id: `deal-${deal.id}`,
              type: 'deal',
              title: `Deal Expected Close: ${deal.title}`,
              description: `Deal "${deal.title}" is expected to close ${closeDate <= now ? 'now' : closeDate <= tomorrow ? 'tomorrow' : 'soon'}`,
              dueDate: deal.expectedCloseDate,
              priority: closeDate <= now ? 'overdue' : closeDate <= tomorrow ? 'urgent' : 'upcoming',
              itemId: deal.id
            });
          }
        }
      }

      // Check projects with end dates
      const projects = await storage.getProjects();
      for (const project of projects) {
        if (project.endDate && project.status !== 'completed' && project.status !== 'cancelled') {
          const endDate = new Date(project.endDate);
          if (endDate <= twoDaysFromNow) {
            reminders.push({
              id: `project-${project.id}`,
              type: 'project',
              title: `Project Due: ${project.name}`,
              description: `Project "${project.name}" is due ${endDate <= now ? 'now' : endDate <= tomorrow ? 'tomorrow' : 'soon'}`,
              dueDate: project.endDate,
              priority: endDate <= now ? 'overdue' : endDate <= tomorrow ? 'urgent' : 'upcoming',
              itemId: project.id
            });
          }
        }
      }

      // Check for items without deadlines (created more than 2 days ago)
      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
      
      // Check leads without follow-up
      const leads = await storage.getLeads();
      for (const lead of leads) {
        if (lead.status === 'new' || lead.status === 'contacted') {
          const createdDate = new Date(lead.createdAt || Date.now());
          if (createdDate <= twoDaysAgo) {
            reminders.push({
              id: `lead-${lead.id}`,
              type: 'lead',
              title: `Follow-up Lead: ${lead.name}`,
              description: `Lead "${lead.name}" needs follow-up (no activity for 2+ days)`,
              dueDate: null,
              priority: 'follow_up',
              itemId: lead.id
            });
          }
        }
      }

      // Sort reminders by priority and date
      reminders.sort((a, b) => {
        const priorityOrder: Record<string, number> = { overdue: 0, urgent: 1, upcoming: 2, follow_up: 3 };
        if (a.priority !== b.priority) {
          return (priorityOrder[a.priority] || 999) - (priorityOrder[b.priority] || 999);
        }
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        return 0;
      });

      res.json(reminders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reminders" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}