# =====================================================================
# CHAT FUNCTION
# =====================================================================

import hashlib

def generate_random_student_id(username):
    """
    Converts a student's actual username into a short, randomized ID so they remain anonymous in the chat while keeping messages trackable.
    
    Example: 'student1' -> 'Student-a3f2b9'
    """
    if not username:
        return "User-Anonymous"
    
    # Hash the username using SHA-256 and take the first 8 characters
    hash_digest = hashlib.sha256(username.encode('utf-8')).hexdigest()
    short_id = hash_digest[:8]
    
    return f"Student-{short_id}"


def handle_incoming_message(user, message_text):
    """
    Placeholder function for processing messages sent from the chat box.
    can expand this later
    """
    display_name = generate_random_student_id(user.username)
    
    # Log or save message logic goes here
    print(f"[CUSTOM CHAT] {display_name} says: {message_text}")
    
    return {
        'status': 'success',
        'sender': display_name,
        'message': message_text
    }