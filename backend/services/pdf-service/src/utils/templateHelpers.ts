import Handlebars from 'handlebars';

// Register Handlebars helpers
export const registerHelpers = () => {
  // Format date helper
  Handlebars.registerHelper('formatDate', (dateString: string) => {
    if (!dateString) return '';
    
    try {
      // Handle YYYY-MM format from month input
      const date = new Date(dateString + '-01');
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
    } catch (error) {
      return dateString;
    }
  });

  // Conditional helper for better template logic
  Handlebars.registerHelper('ifEquals', function(arg1: any, arg2: any, options: any) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
  });

  // Join array helper
  Handlebars.registerHelper('join', function(array: string[], separator: string) {
    if (!Array.isArray(array)) return '';
    return array.filter(item => item && item.trim()).join(separator || ', ');
  });

  // Check if array has items
  Handlebars.registerHelper('hasItems', function(array: any[]) {
    return Array.isArray(array) && array.length > 0;
  });

  // Capitalize first letter
  Handlebars.registerHelper('capitalize', function(str: string) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  });

  // Format current date
  Handlebars.registerHelper('formatCurrentDate', function() {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });

  // Format paragraph with line breaks
  Handlebars.registerHelper('formatParagraph', function(text: string) {
    if (!text) return '';
    return text.replace(/\n/g, '<br>');
  });

  // Current date helper
  Handlebars.registerHelper('currentDate', function() {
    return new Date().toISOString().split('T')[0];
  });
};