const { createClient } = require("@supabase/supabase-js");

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Create Supabase client for general operations (with fallback for testing)
let supabase = null;
let supabaseAdmin = null;

try {
  if (supabaseUrl && supabaseKey && supabaseUrl !== 'https://mock-project.supabase.co') {
    supabase = createClient(supabaseUrl, supabaseKey);
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    console.log('✅ Supabase clients initialized');
  } else {
    console.log('⚠️ Supabase running in mock mode (no real credentials)');
  }
} catch (error) {
  console.log('⚠️ Supabase initialization failed, running without database:', error.message);
}

// Test Supabase connection
const testSupabaseConnection = async () => {
  try {
    if (!supabase) {
      console.log("⚠️ Supabase not initialized (running in mock mode)");
      return false;
    }

    const { data, error } = await supabase
      .from("users")
      .select("count", { count: "exact", head: true });

    if (error && error.code !== "PGRST116") {
      // PGRST116 = table doesn't exist, which is OK during setup
      throw error;
    }

    console.log("✅ Supabase connection successful");
    return true;
  } catch (error) {
    console.error("❌ Supabase connection failed:", error.message);
    return false;
  }
};

// Execute raw SQL queries (for migrations and complex operations)
const executeSQL = async (query, params = []) => {
  try {
    const { data, error } = await supabaseAdmin.rpc("execute_sql", {
      query_text: query,
      params: params,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Supabase SQL execution error:", error);
    throw error;
  }
};

// Helper function for standard CRUD operations
const supabaseQuery = {
  // Select with filters
  select: async (table, columns = "*", filters = {}) => {
    try {
      if (!supabase) {
        throw new Error('Supabase not initialized');
      }

      let query = supabase.from(table).select(columns);

      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error selecting from ${table}:`, error);
      throw error;
    }
  },

  // Insert data
  insert: async (table, data) => {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select();
      if (error) throw error;
      return result;
    } catch (error) {
      console.error(`Error inserting into ${table}:`, error);
      throw error;
    }
  },

  // Update data
  update: async (table, id, data) => {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .eq("id", id)
        .select();
      if (error) throw error;
      return result;
    } catch (error) {
      console.error(`Error updating ${table}:`, error);
      throw error;
    }
  },

  // Delete data
  delete: async (table, id) => {
    try {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error deleting from ${table}:`, error);
      throw error;
    }
  },
};

module.exports = {
  supabase,
  supabaseAdmin,
  testSupabaseConnection,
  executeSQL,
  supabaseQuery,
};
