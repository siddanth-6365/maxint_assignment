import csv
import random
from datetime import datetime, timedelta

# Define categories and descriptions
categories = {
    'Groceries': ['Weekly grocery shopping', 'Supermarket', 'Organic Market'],
    'Utilities': ['Electricity Bill', 'Water Bill', 'Internet Bill', 'Gas Bill'],
    'Entertainment': ['Movie tickets', 'Concert tickets', 'Theater tickets', 'Streaming Subscription'],
    'Salary': ['Monthly Salary', 'Bonus', 'Freelance Payment'],
    'Rent': ['Monthly Rent'],
    'Transportation': ['Monthly Metro Pass', 'Gasoline', 'Taxi Ride'],
    'Healthcare': ['Pharmacy', 'Doctor Appointment', 'Health Insurance'],
    'Dining': ['Restaurant', 'Cafe', 'Fast Food'],
    'Education': ['Tuition Fee', 'Books Purchase', 'Online Course'],
    'Miscellaneous': ['Gift', 'Charity Donation', 'Other Expenses']
}

# Parameters
num_transactions = 100  # Total number of transactions
start_date = datetime(2023, 1, 1)
user_id = 1

# Function to generate random date
def random_date(start, end):
    delta = end - start
    random_days = random.randrange(delta.days)
    return start + timedelta(days=random_days)

# Open CSV file for writing
with open('synthetic_transactions.csv', mode='w', newline='') as file:
    writer = csv.writer(file)
    # Write header
    writer.writerow(['id', 'user_id', 'date', 'category', 'amount', 'description'])
    
    for txn_id in range(1, num_transactions + 1):
        # Randomly choose a category
        category = random.choice(list(categories.keys()))
        # Randomly choose a description based on category
        description = random.choice(categories[category])
        # Generate a random date
        date = random_date(start_date, datetime.now()).strftime('%Y-%m-%d')
        
        # Determine amount based on category
        if category == 'Salary':
            amount = round(random.uniform(2500, 5000), 2)
        elif category == 'Rent':
            amount = round(-random.uniform(1000, 2000), 2)
        elif category == 'Utilities':
            amount = round(-random.uniform(50, 200), 2)
        elif category == 'Groceries':
            amount = round(-random.uniform(100, 300), 2)
        elif category == 'Entertainment':
            amount = round(-random.uniform(20, 200), 2)
        elif category == 'Transportation':
            amount = round(-random.uniform(30, 150), 2)
        elif category == 'Healthcare':
            amount = round(-random.uniform(20, 500), 2)
        elif category == 'Dining':
            amount = round(-random.uniform(10, 100), 2)
        elif category == 'Education':
            amount = round(-random.uniform(100, 1000), 2)
        else:
            amount = round(-random.uniform(10, 300), 2)
        
        # For income categories like Salary, ensure amount is positive
        if category in ['Salary']:
            amount = abs(amount)
        
        # Write the row
        writer.writerow([txn_id, user_id, date, category, amount, description])

print("Synthetic transactions.csv generated successfully.")
