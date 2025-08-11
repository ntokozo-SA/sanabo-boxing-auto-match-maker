# Sanabo Boxing Matchmaking System

A comprehensive boxing matchmaking system with public event display functionality.

## Features

### Public Event Display
- **Single Public Page**: All fights for the current event day are displayed on one page at `/fights`
- **Mobile-Friendly**: Responsive design optimized for mobile devices
- **Read-Only**: Public access without admin capabilities
- **Real-Time Updates**: Shows live fight information and results
- **QR Code Access**: Event attendees can scan QR codes to access the public page

### Event Management
- **Today's Fights Only**: All matches are scheduled for the current day
- **Upcoming vs Completed**: Tabbed view to separate scheduled and finished fights
- **Fight Details**: Complete information including boxers, venues, times, and results
- **Result Tracking**: Real-time display of fight outcomes and methods

### System Architecture
- **Public Routes**: Only the fights page is accessible without authentication
- **Admin Redirect**: All admin routes redirect to the public page
- **Clean Navigation**: Minimal header with only essential public information

## Quick Start

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Application**:
   ```bash
   npm start
   ```

3. **Access the Public Page**:
   - Main URL: `http://localhost:3000/fights`
   - Alternative URLs: `/`, `/public-fights`, `/event-today`
   - All redirect to the same public fights display

## Public Page Features

### Navigation
- **Today's Fights**: Main navigation link
- **Public View Indicator**: Shows this is a public display
- **Mobile Menu**: Responsive navigation for mobile devices

### Fight Display
- **Fight Cards**: Individual cards for each match
- **Red/Blue Corners**: Authentic boxing terminology
- **Winner/Loser Indicators**: Visual indicators for completed fights
- **Result Details**: Method, rounds, and timing information
- **Statistics**: Overview of upcoming, completed, and total fights

### Mobile Optimization
- **Responsive Grid**: Adapts to different screen sizes
- **Touch-Friendly**: Optimized for mobile interaction
- **Readable Text**: Appropriate font sizes for mobile devices
- **Compact Layout**: Efficient use of screen space

## QR Code Integration

- **Single QR Code**: One QR code for the entire event
- **Direct Access**: QR codes point directly to `/fights`
- **No Authentication**: Public access without login requirements
- **Event-Specific**: Shows only today's fights

## Technical Details

### Routes
- `/fights` - Main public page (also accessible via `/`, `/public-fights`, `/event-today`)
- All other routes redirect to `/fights` for public access

### Data Filtering
- **Date Filter**: Only shows matches scheduled for today
- **Status Filter**: Separates upcoming and completed fights
- **Real-Time**: Updates automatically as fights are completed

### Security
- **Read-Only Access**: No editing capabilities on public page
- **Admin Protection**: All admin routes redirect to public page
- **Clean Interface**: No sensitive information exposed

## Development

### Key Components
- `PublicFightsDisplay.js` - Main public page component
- `Header.js` - Simplified navigation for public view
- `App.js` - Route configuration with redirects
- `matchmaking.js` - Updated to use today's date by default

### API Endpoints
- `GET /api/matches?scheduledDate=YYYY-MM-DD` - Get today's fights
- `POST /api/matches/matchmaking` - Generate matches for today

## Event Management

### Match Generation
- All matches are created for today's date by default
- QR codes point to the single public page
- No individual fight URLs needed

### Result Recording
- Results are displayed in real-time on the public page
- Winner/loser indicators with visual styling
- Complete result details including method and timing

This system provides a streamlined, mobile-friendly public display for boxing events with all fights consolidated on a single page for easy access by event attendees.