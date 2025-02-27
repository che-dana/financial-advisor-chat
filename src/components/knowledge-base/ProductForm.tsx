const handleSave = () => {
  // Existing save logic...
  
  // After saving to localStorage
  refreshKnowledgeBase(); // Call the refresh function from context
  
  toast({
    title: "Changes Saved",
    description: "Your changes have been saved successfully.",
  });
}; 